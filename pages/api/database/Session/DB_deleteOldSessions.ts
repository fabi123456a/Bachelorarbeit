import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../prismaclient/_prismaClient";

export default async function DB_deleteOldSessions(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const twentyMinutesAgo = new Date(Date.now() - 20 * 60 * 1000); // Datum vor 20 Minuten
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000); // Datum vor 60 Sekunden
  const twentySecondsAgo = new Date(Date.now() - 20 * 1000); // Datum vor 20 Sekunden

  try {
    await prismaClient.session.deleteMany({
      where: {
        startDate: {
          lt: twentySecondsAgo,
        },
      },
    });
    console.log("DB_DELETE -> delteOldSessions");
    res.send(true);
  } catch (e) {
    console.log("DB_DELETE: delteOldSessions FEHLGESCHLAGEN");
    res.send(false);
  }
}
