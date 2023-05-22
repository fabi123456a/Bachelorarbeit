import { NextApiRequest, NextApiResponse } from "next";
import { checkSessionID } from "../Session/_checkSessionID";
import { ChatEntry } from "@prisma/client";
import { prismaClient } from "../../prismaclient/_prismaClient";

export default async function DB_getAllChatEntrys(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const sessionID = req.cookies.sessionID;

  const session = await checkSessionID(sessionID);

  if (session) {
    const chatEntrys: ChatEntry[] = await prismaClient.chatEntry.findMany({
      orderBy: {
        datum: "desc", // oder 'desc' für absteigende Sortierung
      },
    });

    if (chatEntrys == null)
      res.status(200).json({ result: "fehler beim laden der Scenes" });
    else {
      res.status(200).json(chatEntrys);
    }
  } else {
    console.log("ungültige Session ID: " + sessionID);
    res.status(200).json(null);
  }
}