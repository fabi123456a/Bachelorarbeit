import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "./_prismaClient";

export default async function test(req: NextApiRequest, res: NextApiResponse) {
  // const pw = req.query.pw as string;
  // const user = req.query.user as string;
  // try {
  //   const result = await prismaClient.user.create({
  //     data: {
  //       loginID: user,
  //       password: pw,
  //     },
  //   });
  //   //await prisma.$disconnect();
  //   res.status(200).json({ result: "ok" });
  // } catch (err) {
  //   console.log("insertUser ist fehlgeschlagen");
  // }
}
