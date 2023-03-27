import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "./_prismaClient";

export default async function checkPassword(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const users = await prismaClient.user.findMany();

  if (users == null) res.status(200).json({ result: false });
  else res.status(200).json({ result: users });
}
