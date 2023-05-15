import { NextApiRequest, NextApiResponse } from "next";
import { checkSessionID } from "./_checkSessionID";
import { Session } from "@prisma/client";
import { prismaClient } from "../../prismaclient/_prismaClient";

export default async function DB_sessionKeepAlive(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const sessionID = req.cookies.sessionID;

  await prismaClient.session.update({
    where: {
      id: sessionID,
    },
    data: {
      startDate: new Date(),
    },
  });

  console.log("session keep alive");
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
