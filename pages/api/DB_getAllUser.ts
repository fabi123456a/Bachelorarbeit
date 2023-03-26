import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function checkPassword(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const users = await prisma.user.findMany();

  if (users == null) res.status(200).json({ result: false });
  else res.status(200).json({ result: users });
}
