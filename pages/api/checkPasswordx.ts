import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

type Session= {
  id: string,
  user: string,
}

let sessions=new Map<string, Session>();

export default async function checkPassword(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const pw = req.query.pw as string;
  const user = req.query.user as string;

  const selectedUser = await prisma.user.findFirst({
    where: {
      AND: [{ loginID: user }, { password: pw }],
    },
  });

  if (selectedUser == null) res.status(200).json({ result: false });
  else {

    let session= {
      id: randomUUID(),
      user: user,
    }

    sessions.set(session.id, session);

    // res.cookies.set("session", session.id);

    res.status(200).json({ result: true });

  }
}
