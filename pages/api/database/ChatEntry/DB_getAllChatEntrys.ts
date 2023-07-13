import { NextApiRequest, NextApiResponse } from "next";
import { checkSessionID } from "../Session/_checkSessionID";
import { ChatEntry } from "@prisma/client";
import { prismaClient } from "../../prismaclient/_prismaClient";
import checkUserRights from "../User/_checkUserRights";

export default async function DB_getAllChatEntrysBySceneID(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const flag = await checkSessionID(req, res);
  if (!flag) return;

  const rights = await checkUserRights(req, res, false, false);
  if (!rights) return;

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
