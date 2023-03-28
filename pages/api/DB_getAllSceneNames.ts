import { NextApiRequest, NextApiResponse } from "next";
import { checkSessionID } from "./_checkSessionID";
import { ModelScene } from "./_models";
import { prismaClient } from "./_prismaClient";

export default async function DB_getAllSceneNames(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const sessionID = req.cookies.sessionID;

  const session = await checkSessionID(sessionID);

  if (session) {
    const scenes: ModelScene[] = await prismaClient.scenes.findMany();

    if (scenes == null)
      res.status(200).json({ result: "fehler beim laden der Scenes" });
    else {
      res.status(200).json(scenes);
    }
  } else {
    console.log("ungültige Session ID: " + sessionID);
    res.status(200).json(null);
  }
}
