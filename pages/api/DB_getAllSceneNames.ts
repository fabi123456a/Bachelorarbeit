import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export type ModelScene = {
  id: string;
  idUserCreater: string;
  name: string;
  createDate: Date;
  path: string;
};

export default async function DB_getAllSceneNames(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const scenes: ModelScene[] = await prisma.scene.findMany();

  if (scenes == null)
    res.status(200).json({ result: "fehler beim laden der Scenes" });
  else {
    res.status(200).json(scenes);
  }
}
