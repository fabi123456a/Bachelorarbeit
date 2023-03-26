import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function test(req: NextApiRequest, res: NextApiResponse) {
  const pw = req.query.pw as string;
  const user = req.query.user as string;

  try {
    const result = await prisma.user.create({
      data: {
        loginID: user,
        password: pw,
      },
    });

    //await prisma.$disconnect();

    res.status(200).json({ result: "ok" });
  } catch (err) {
    console.log("insertUser ist fehlgeschlagen");
  }
}
