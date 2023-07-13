import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../prismaclient/_prismaClient";
import { User } from "@prisma/client";
import { checkSessionID } from "../Session/_checkSessionID";
import checkUserRights from "./_checkUserRights";

export default async function DB_getUserByID(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const flag = await checkSessionID(req, res);
  if (!flag) return;

  const rights = await checkUserRights(req, res, false, false);
  if (!rights) return;

  const b = req.body;
  const requestData = JSON.parse(b);
  const idUser = requestData["idUser"];

  const user: User = await prismaClient.user.findFirst({
    where: { id: idUser },
  });

  if (user == null) {
    res.status(200).json(null);
    console.log("DB: user mit id NICHT gefunden " + idUser);
  } else {
    console.log("DB: user mit id gefunden " + idUser);
    res.status(200).json(user);
  }
}
