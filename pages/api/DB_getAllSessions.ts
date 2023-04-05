import { NextApiRequest, NextApiResponse } from "next";
import { checkSessionID } from "./_checkSessionID";
import { ModelScene, ModelSession } from "./_models";
import { prismaClient } from "./_prismaClient";

export default async function DB_getAllSessions(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const sessionID = req.cookies.sessionID;

  const session = await checkSessionID(sessionID);

  if (session) {
    const sessions: ModelSession[] = await prismaClient.sessions.findMany();

    if (sessions == null)
      res.status(200).json({ result: "fehler beim laden der Sessions" });
    else {
      res.status(200).json(sessions);
    }
  } else {
    console.log("ungültige Session ID: " + sessionID);
    res.status(200).json(null);
  }
}
