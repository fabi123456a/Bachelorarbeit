import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../prismaclient/_prismaClient";
import { User } from "@prisma/client";

export default async function DB_getUserByID(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const b = req.body;
  const requestData = JSON.parse(b);

  const user: User = await prismaClient.user.findFirst({
    where: { id: requestData["idUser"] },
  });

  if (user == null) res.status(200).json({ result: false });
  else {
    res.status(200).json(user);
  }
}
