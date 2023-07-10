import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../prismaclient/_prismaClient";
import { User } from "@prisma/client";

export default async function DB_getUserByLoginID(
  req: NextApiRequest,
  res: NextApiResponse
) {
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