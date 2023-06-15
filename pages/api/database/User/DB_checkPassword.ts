import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { Session, User } from "@prisma/client";
import { prismaClient } from "../../prismaclient/_prismaClient";
import cookieParser from "cookie-parser";

export default async function DB_checkPassword(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const pw1 = req.query.pw as string;
  // const user1 = req.query.user as string;

  const b = req.body;
  const requestData = JSON.parse(b);
  const user = requestData["loginID"];
  const pw = requestData["pw"];

  const selectedUser: User = await prismaClient.user.findFirst({
    where: {
      AND: [{ loginID: user }, { password: pw }],
    },
  });

  if (selectedUser == null) {
    console.log("DB_SELECT FIRST -> checkpassword FALSE");
    res.status(200).json(null);
  } else {
    console.log("DB_SELECT FIRST -> checkpassword TRUE");

    // neue Session mit der id des benutzers hinzufügen
    const session: Session = await insertSession(selectedUser.id);
    console.log("DB_INSERT session -> sessionID: " + session.id);

    // session in cookie
    res.setHeader("Set-Cookie", `sessionID=${session.id};`); // TODO: HTTPONLY
    console.log("SETCOOKIE -> " + session.id);

    const cookieValue = res.getHeader("Set-Cookie");
    console.log("x:" + JSON.stringify(cookieValue));

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
