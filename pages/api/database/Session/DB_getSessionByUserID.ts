import { NextApiRequest, NextApiResponse } from "next";
import { checkSessionID } from "./_checkSessionID";
import { Session } from "@prisma/client";
import { prismaClient } from "../../prismaclient/_prismaClient";
import checkUserRights from "../User/_checkUserRights";

export default async function DB_getSessionByUserID(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const rights = await checkUserRights(req, res, false, false);
  if (!rights) return;

  const b = req.body;
  const requestData = JSON.parse(b);
  const idUser = requestData["idUser"];

  try {
    const session: Session = await prismaClient.session.findFirst({
      where: { idUser: idUser },
    });

    if (session == null) {
      console.log("DB: get session by idUser " + idUser + " FEHLGESCHLAGEN");
      res.status(200).json(null);
    } else {
      console.log("DB: get session by idUser " + idUser);
      res.status(200).json(session);
    }
  } catch (err) {
    console.log(err);
    res.status(200).json(null);
  }
}
