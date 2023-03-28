import { ModelSession } from "./_models";
import { prismaClient } from "./_prismaClient";

export async function checkSessionID(sessionID: string): Promise<ModelSession> {
    const session: ModelSession = await prismaClient.sessions.findFirst({
      where: {
        id: sessionID,
      },
    });
  
    if (session == null) return null;
    else return session;
  }