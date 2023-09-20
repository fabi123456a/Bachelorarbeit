import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { Session, User } from "@prisma/client";
import { prismaClient } from "../../prismaclient/_prismaClient";
import { checkSessionID } from "../Session/_checkSessionID";

export default async function DB_checkPassword(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const b = req.body;
  const requestData = JSON.parse(b);
  const email = requestData["loginID"];
  const pw = requestData["pw"];

  console.log("Login versuch: " + pw + ", " + email);
  if (!prismaClient) res.status(200).json(null);

  // versuchen den Benutzer anhand der login Daten (email & pw) zu laden
  const selectedUser: User = await prismaClient.user.findFirst({
    where: {
      AND: [{ email: email }, { password: pw }],
    },
  });

  // prüfen ob ein Benutzer gefunden wurde
  if (selectedUser == null) {
    console.log("checkpassword => FALSE");
    res.status(200).json(null);
  } else {
    console.log("checkpassword => TRUE");

    // alle session des Benutzers löschen
    await prismaClient.session.deleteMany({
      where: {
        idUser: selectedUser.id,
      },
    });

    // session anlegen
    const session: Session = await insertSession(selectedUser.id);
    console.log("DB_INSERT session -> sessionID: " + session.id);

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
