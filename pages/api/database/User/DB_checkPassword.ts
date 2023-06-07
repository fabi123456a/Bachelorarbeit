import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { Session, User } from "@prisma/client";
import { prismaClient } from "../../prismaclient/_prismaClient";

export default async function DB_checkPassword(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const pw = req.query.pw as string;
  const user = req.query.user as string;

  const selectedUser: User = await prismaClient.user.findFirst({
    where: {
      AND: [{ loginID: user }, { password: pw }],
    },
  });

  if (selectedUser == null) res.status(200).json(null);
  else {
    // neue Session mit der id des benutzers hinzufügen 
    const session: Session = await insertSession(selectedUser.id);

    // session in cookie
    res.setHeader("Set-Cookie", `sessionID=${session.id};HttpOnly`); // HTTPONLY

    // eingeloggten user + session zurücksenden
    res.status(200).json(selectedUser);
  }
}

async function insertSession(idUser: string): Promise<Session> {
  const sessionData: Session = {
    id: randomUUID(),
    idUser: idUser,
    startDate: new Date(),
  };

  const session: Session = await prismaClient.session.create({
    data: sessionData,
  });

  return session;
}
