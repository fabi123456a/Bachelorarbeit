import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../prismaclient/_prismaClient";
import { checkSessionID } from "../Session/_checkSessionID";

export default async function DB_getAllUsers(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const flag = await checkSessionID(req, res);
  if (!flag) return;

  const users = await prismaClient.user.findMany();

  if (users == null) res.status(200).json(false);
  else res.status(200).json(users);
}
