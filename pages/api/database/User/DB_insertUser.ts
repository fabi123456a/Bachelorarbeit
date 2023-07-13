import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../prismaclient/_prismaClient";
import { checkSessionID } from "../Session/_checkSessionID";
import checkUserRights from "./_checkUserRights";

// fügt einen neuen user in die database ein
// wenn es funktioniert hat, wird das user object zurückgeliefert ansonsten NULL
export default async function test(req: NextApiRequest, res: NextApiResponse) {
  const flag = await checkSessionID(req, res);
  if (!flag) return;

  const rights = await checkUserRights(req, res, false, true);
  if (!rights) return;

  const b = req.body;
  const requestData = JSON.parse(b);

  try {
    const user = await prismaClient.user.create({
      data: {
        id: randomUUID(),
        loginID: requestData["loginID"],
        password: requestData["pw"],
        readOnly: false,
        isAdmin: false,
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
