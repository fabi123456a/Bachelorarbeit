import { prismaClient } from "../../prismaclient/_prismaClient";
import { Session } from "@prisma/client";

export async function checkSessionID(sessionID: string): Promise<Session> {
  const session: Session = await prismaClient.session.findFirst({
    where: {
      id: sessionID,
    },
  });

  if (session == null) return null;
  else return session;
}
