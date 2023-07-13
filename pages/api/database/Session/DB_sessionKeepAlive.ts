import { NextApiRequest, NextApiResponse } from "next";
import { checkSessionID } from "./_checkSessionID";
import { Session } from "@prisma/client";
import { prismaClient } from "../../prismaclient/_prismaClient";
import checkUserRights from "../User/_checkUserRights";

export default async function DB_sessionKeepAlive(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const flag = await checkSessionID(req, res);
  if (!flag) return;

  const rights = await checkUserRights(req, res, false, false);
  if (!rights) return;

  // await prismaClient.session.update({
  //   where: {
  //     id: sessionID,
  //   },
  //   data: {
  //     startDate: new Date(),
  //   },
  // });

  console.log("DB_UPDATE -> session keep alive");
  //   const session = await checkSessionID(sessionID);

  //   if (session) {
  //     const sessions: ModelSession[] = await prismaClient.sessions.findMany();

  //     if (sessions == null)
  //       res.status(200).json({ result: "fehler beim laden der Sessions" });
  //     else {
  //       res.status(200).json(sessions);
  //     }
  //   } else {
  //     console.log("ungültige Session ID: " + sessionID);
  //     res.status(200).json(null);
  //   }
}
