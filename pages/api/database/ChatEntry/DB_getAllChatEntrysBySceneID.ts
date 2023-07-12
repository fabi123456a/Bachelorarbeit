import { NextApiRequest, NextApiResponse } from "next";
import { checkSessionID } from "../Session/_checkSessionID";
import { ChatEntry } from "@prisma/client";
import { prismaClient } from "../../prismaclient/_prismaClient";

export default async function DB_getAllChatEntrysBySceneID(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const flag = await checkSessionID(req, res);
  if (!flag) return;

  const b = req.body;
  const requestData = JSON.parse(b);
  const idScene = requestData["idScene"];

  const chatEntrys: ChatEntry[] = await prismaClient.chatEntry.findMany({
    where: {
      idScene: idScene,
    },
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
