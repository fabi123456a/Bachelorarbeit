import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export type ModelUser = {
  id: string;
  loginID: string;
  password: string;
};

export default async function DB_checkPassword(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const pw = req.query.pw as string;
  const user = req.query.user as string;

  const selectedUser: ModelUser = await prisma.user.findFirst({
    where: {
      AND: [{ loginID: user }, { password: pw }],
    },
  });

  if (selectedUser == null) res.status(200).json({ result: false });
  else {
    res.status(200).json({ result: selectedUser });
  }
}
