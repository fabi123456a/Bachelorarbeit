import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../prismaclient/_prismaClient";
import { User } from "@prisma/client";

export default async function DB_getUserByID(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
