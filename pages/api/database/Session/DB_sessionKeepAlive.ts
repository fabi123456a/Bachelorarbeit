import { NextApiRequest, NextApiResponse } from "next";
import { checkSessionID } from "./_checkSessionID";
import { prismaClient } from "../../prismaclient/_prismaClient";

export default async function DB_sessionKeepAlive(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const b = req.body;
  const requestData = JSON.parse(b);
  const sessionID = requestData["sessionID"];

  try {
    await prismaClient.session.update({
      where: {
        id: sessionID,
      },
      data: {
        startDate: new Date(),
      },
    });

    console.log("session keep alive: " + sessionID);
  } catch (e) {
    console.log(e);
  }
}
