import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../prismaclient/_prismaClient";
import { Session } from "@prisma/client";

export async function checkSessionID(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<boolean> {
  const body = request.body;
  const requestData = JSON.parse(body);
  const sessionID = requestData["sessionID"];

  const session: Session = await prismaClient.session.findFirst({
    where: {
      id: sessionID,
    },
  });

  if (!session) {
    console.log("request ZUGRIFF VERWEIGERT - ungültige sessionID");
    response.status(403).json({ error: "Zugriff verweigert." });
    return false;
  } else {
    console.log("request ZUGRIFF ERLAUBT");
    return true;
  }
}
