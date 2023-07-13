import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../prismaclient/_prismaClient";
import { User } from "@prisma/client";
import { checkSessionID } from "../Session/_checkSessionID";
import checkUserRights from "./_checkUserRights";

export default async function DB_getUserByLoginID(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const flag = await checkSessionID(req, res);
  if (!flag) return;

  const rights = await checkUserRights(req, res, false, true);
  if (!rights) return;

  const b = req.body;
  const requestData = JSON.parse(b);
  const loginID = requestData["loginID"];

  const user: User = await prismaClient.user.findFirst({
    where: { loginID: loginID },
  });

  if (user == null) {
    res.status(200).json(null);
    console.log("DB: user mit loginID NICHT gefunden " + loginID);
  } else {
    console.log("DB: user mit loginID gefunden " + loginID);
    res.status(200).json(user);
  }
}
