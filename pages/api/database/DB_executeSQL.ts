import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../prismaclient/_prismaClient";
import { checkSessionID } from "./Session/_checkSessionID";
import checkUserRights from "./User/_checkUserRights";

export default async function DB_executeSQL(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { tableName, action, where, data, include } = req.body;

  console.log(
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
    res.status(500).json({ error: "An error occurred while DB_excuteSQL." });
  }
}
