import { NextApiRequest, NextApiResponse } from "next";
import { checkSessionID } from "./_checkSessionID";
import { Session } from "@prisma/client";
import { prismaClient } from "../../prismaclient/_prismaClient";
import checkUserRights from "../User/_checkUserRights";

export default async function DB_getAllSessions(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const flag = await checkSessionID(req, res);
  if (!flag) return;

  const rights = await checkUserRights(req, res, false, false);

  const sessions: Session[] = await prismaClient.session.findMany({});

  if (sessions == null)
    res.status(200).json({ result: "fehler beim laden der Sessions" });
  else {
    res.status(200).json(sessions);
  }
}
