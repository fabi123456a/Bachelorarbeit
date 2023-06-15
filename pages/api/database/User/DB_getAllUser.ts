import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../prismaclient/_prismaClient";

export default async function DB_getAllUsers(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const users = await prismaClient.user.findMany();

  if (users == null) res.status(200).json(false);
  else res.status(200).json(users);
}
