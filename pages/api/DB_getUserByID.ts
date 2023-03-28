import { NextApiRequest, NextApiResponse } from "next";

import { ModelScene, ModelUser } from "./_models";
import { prismaClient } from "./_prismaClient";

export default async function DB_getUserByID(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const b = req.body;
  const requestData = JSON.parse(b);

  const user: ModelUser = await prismaClient.users.findFirst({
    where: { id: requestData["idUser"] },
  });

  if (user == null) res.status(200).json({ result: false });
  else {
    res.status(200).json(user);
  }
}
