import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../prismaclient/_prismaClient";
import { checkSessionID } from "./Session/_checkSessionID";
import checkUserRights from "./User/_checkUserRights";

export default async function DB_executeSQL(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { tableName, action, where, data, include, sessionID, idUser } =
    req.body;

  // SESSION
  const check = await checkSessionID(sessionID);
  if (!check) {
    console.log(
      "\x1b[31m%s\x1b[0m",
      "request ZUGRIFF VERWEIGERT - keine gültige SessionID"
    );
    res.status(403).json({
      error: "Zugriff verweigert: Unngültige SessionID.",
    });
    return;
  }

  // RECHTE
  const rights = await checkUserRights(idUser, action);
  if (!rights) {
    console.log(
      "\x1b[31m%s\x1b[0m",
      "request ZUGRIFF VERWEIGERT - keine Rechte"
    );
    res.status(403).json({
      error:
        "Zugriff verweigert: Der Nutzer hat keine Rechte für diese Aktion.",
    });
    return;
  }

  console.log(
    "\x1b[95m%s\x1b[0m",
    `D A T A B A S E : ${action} in ${tableName} where ${JSON.stringify(
      where
    )} `
  );

  try {
    let result;

    switch (action) {
      case "select":
        if (include)
          result = await prismaClient[tableName].findMany({
            where: where,
            include: include,
          });
        else result = await prismaClient[tableName].findMany({ where: where });
        break;
      case "create":
        result = await prismaClient[tableName].create({ data: data });
        break;
      case "update":
        result = await prismaClient[tableName].update({
          where: where,
          data: data,
        });
        break;
      case "delete":
        result = await prismaClient[tableName].delete({ where: where });
        break;
      default:
        return res.status(400).json({ error: "Invalid action." });
    }

    console.log(`DB_excuteSQL => ${JSON.stringify(result)}`);

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
}
