import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

const prisma = new PrismaClient();

export default async function test(req: NextApiRequest, res: NextApiResponse) {
  const { filename } = req.body;

  const fileFolder: string = "/public/fbx";

  if (filename == null || fileFolder == null) {
    res.status(200).json({ text: "name or folder is null" });
    return;
  }

  const user = await prisma.fbxModel.create({
    data: {
      name: filename,
      folder: fileFolder,
    },
  });

  //await prisma.$disconnect();

  res.status(200).json({ text: "ok" });
}
