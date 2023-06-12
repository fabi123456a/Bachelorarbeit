import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../prismaclient/_prismaClient";

// fügt einen neuen user in die database ein
// wenn es funktioniert hat, wird das user object zurückgeliefert ansonsten NULL
export default async function test(req: NextApiRequest, res: NextApiResponse) {
  const b = req.body;
  const requestData = JSON.parse(b);

  try {
    const user = await prismaClient.user.create({
      data: {
        id: randomUUID(),
        loginID: requestData["loginID"],
        password: requestData["pw"],
        readOnly: false,
      },
    });
    //await prisma.$disconnect();

    console.log(
      "DB_INSERT user -> loginID: " +
        requestData["loginID"] +
        ", password: " +
        requestData["pw"]
    );

    res.status(200).json(user);
  } catch (err) {
    res.status(200).json(null);
  }
}
