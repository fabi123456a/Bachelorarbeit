import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { Session, User } from "@prisma/client";
import { prismaClient } from "../../prismaclient/_prismaClient";
import { checkSessionID } from "../Session/_checkSessionID";

export default async function DB_checkPassword(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const flag = await checkSessionID(req, res);
  // if (!flag) return;

  const b = req.body;
  const requestData = JSON.parse(b);
  const user = requestData["loginID"];
  const pw = requestData["pw"];

  console.log(pw + ", " + user);
  if (!prismaClient) res.status(200).json({ error: "prismaclient fehler" });

  const selectedUser: User = await prismaClient.user.findFirst({
    where: {
      AND: [{ email: user }, { password: pw }],
    },
  });

  if (selectedUser == null) {
    console.log("checkpassword => FALSE");
    res.status(200).json(null);
  } else {
    console.log("checkpassword => TRUE");

    await prismaClient.session.deleteMany({
      where: {
        idUser: selectedUser.id,
      },
    });

    const session: Session = await insertSession(selectedUser.id);
    console.log("DB_INSERT session -> sessionID: " + session.id);

    res.setHeader("Set-Cookie", "sessionID=cookieValue");

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
