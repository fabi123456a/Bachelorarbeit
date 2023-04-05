import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { ModelSession, ModelUser } from "./_models";
import { prismaClient } from "./_prismaClient";

export default async function DB_checkPassword(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const pw = req.query.pw as string;
  const user = req.query.user as string;

  const selectedUser: ModelUser = await prismaClient.users.findFirst({
    where: {
      AND: [{ loginID: user }, { password: pw }],
    },
  });

  if (selectedUser == null) res.status(200).json(null);
  else {
    // neue Session hinzufügen
    const session: ModelSession = await insertSession(selectedUser.id);

    // session in cookie
    res.setHeader("Set-Cookie", `sessionID=${session.id};HttpOnly`); // HTTPONLY

    // eingeloggten user + session zurücksenden
    res.status(200).json(selectedUser);
  }
}

async function insertSession(idUser: string): Promise<ModelSession> {
  const sessionData: ModelSession = {
    id: randomUUID(),
    idUser: idUser,
    startDate: new Date(),
  };

  const session: ModelSession = await prismaClient.sessions.create({
    data: sessionData,
  });

  return session;
}
