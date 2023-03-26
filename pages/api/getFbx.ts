import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function test(req: NextApiRequest, res: NextApiResponse) {
  const fbxName = req.query.fbxName as string;

  const fbxModel = await prisma.fbxModel.findFirst({
    where: {
      name: fbxName,
    },
  });

  //await prisma.$disconnect();

  res.status(200).json({ txt: fbxModel.folder });
}
