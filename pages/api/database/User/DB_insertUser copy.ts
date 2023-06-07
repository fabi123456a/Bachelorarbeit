import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { checkSessionID } from "../Session/_checkSessionID";
import { prismaClient } from "../../prismaclient/_prismaClient";

export default async function test(req: NextApiRequest, res: NextApiResponse) {
  const pw = req.query.pw as string;
  const loginID = req.query.user as string;
  const sessionID = req.cookies.sessionID;

  const session = await checkSessionID(sessionID);

  if (session) {
    try {
      const user = await prismaClient.user.create({
        data: {
          id: randomUUID(),
          loginID: loginID,
          password: pw,
        },
      });
      //await prisma.$disconnect();
      res.status(200).json(user);
    } catch (err) {
      console.log("insert User ist fehlgeschlagen");
    }
  } else {
    console.log("ungültige Session ID: " + sessionID);
    res.status(200).json(null);
  }
}
