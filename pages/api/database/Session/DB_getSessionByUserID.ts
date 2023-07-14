import { NextApiRequest, NextApiResponse } from "next";
import { checkSessionID } from "./_checkSessionID";
import { Session } from "@prisma/client";
import { prismaClient } from "../../prismaclient/_prismaClient";
import checkUserRights from "../User/_checkUserRights";

export default async function DB_getSessionByUserID(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // check ob user

  const b = req.body;
  const requestData = JSON.parse(b);
  const idUser = requestData["idUser"];

  if (!idUser) {
    console.log(
      "\x1b[31m%s\x1b[0m",
      "request ZUGRIFF VERWEIGERT - ungültige userID"
    );
    res.status(403).json({
      error: "Zugriff verweigert: ungültige userID",
    });
    return;
  }

  try {
    const session: Session = await prismaClient.session.findFirst({
      where: { idUser: idUser },
    });

    if (!session) {
      console.log(
        "\x1b[31m%s\x1b[0m",
        "DB: get session by idUser " + idUser + " FEHLGESCHLAGEN"
      );
      res.status(403).json({
        error: "Zugriff verweigert: ungültige userID",
      });
    } else {
      console.log("\x1b[32m%s\x1b[0m", "DB: get SESSION by idUser " + idUser);
      res.status(200).json(session);
    }
  } catch (err) {
    console.log(err);
    res.status(200).json({
      error: "Zugriff verweigert: ungültige userID",
    });
  }
}
