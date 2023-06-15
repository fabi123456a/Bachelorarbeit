import { NextApiRequest, NextApiResponse } from "next";
import { checkSessionID } from "../Session/_checkSessionID";
import { ChatEntry } from "@prisma/client";
import { prismaClient } from "../../prismaclient/_prismaClient";

export default async function DB_getAllChatEntrys(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const sessionID = req.cookies.sessionID;
  console.log("CHatEntry cookie: " + sessionID);

  const session = await checkSessionID(sessionID);

  const chatEntrys: ChatEntry[] = await prismaClient.chatEntry.findMany({
    orderBy: {
      datum: "desc", // oder 'desc' für absteigende Sortierung
    },
    include: {
      user: true, // Hier wird die Beziehung zum User eingeschlossen
    },
  });

  if (chatEntrys == null) res.status(200).json(null);
  else {
    res.status(200).json(chatEntrys);
  }
}
