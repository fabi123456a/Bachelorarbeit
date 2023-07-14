import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../prismaclient/_prismaClient";
import { Session } from "@prisma/client";

export async function checkSessionID(sessionID: string): Promise<boolean> {
  if (!sessionID) {
    console.log(
      "\x1b[31m%s\x1b[0m",
      "request ZUGRIFF VERWEIGERT - ungültige sessionID"
    );
    return false;
  }

  const session: Session = await prismaClient.session.findFirst({
    where: {
      id: sessionID,
    },
  });

  if (!session) {
    console.log(
      "\x1b[31m%s\x1b[0m",
      "request ZUGRIFF VERWEIGERT - ungültige sessionID"
    );
    return false;
  } else {
    console.log(
      "\x1b[32m%s\x1b[0m",
      "request ZUGRIFF ERLAUBT - gültige sessionID"
    );
    return true;
  }
}
