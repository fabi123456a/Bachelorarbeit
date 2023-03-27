import { NextApiRequest, NextApiResponse } from "next";
import { ModelScene } from "./_models";
import { prismaClient } from "./_prismaClient";

export default async function DB_getAllSceneNames(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const scenes: ModelScene[] = await prismaClient.scene.findMany();

  if (scenes == null)
    res.status(200).json({ result: "fehler beim laden der Scenes" });
  else {
    res.status(200).json(scenes);
  }
}
