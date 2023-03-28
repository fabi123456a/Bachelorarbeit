import { NextApiRequest, NextApiResponse } from "next";
import { ModelSession } from "./_models";
import { prismaClient } from "./_prismaClient";

export default async function DB_getAllSceneNames(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const sessionidCookie = req.cookies.sessionID;
  const body = req.body;
  const jsonObject = JSON.parse(body);
  const sessionID = jsonObject["sessionID"];

  const session: ModelSession = await prismaClient.sessions.findFirst({
    where: {
      id: sessionID,
    },
  });

  if (session == null) res.status(200).json(null);
  else {
    res.status(200).json(session);
  }
}
