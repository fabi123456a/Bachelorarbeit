import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../prismaclient/_prismaClient";
import { checkSessionID } from "../Session/_checkSessionID";

// fügt einen neuen user in die database ein
// wenn es funktioniert hat, wird das user object zurückgeliefert ansonsten NULL
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const flag = await checkSessionID(req, res);
  if (!flag) return;
  
  const b = req.body;
  const requestData = JSON.parse(b);
  const id = requestData["id"];

  try {
    const memberShip = await prismaClient.sceneMemberShip.delete({
      where: {
        id: id,
      },
    });

    if (memberShip) {
      console.log("DB: memebrship wurde gelöscht");
      res.status(200).json(memberShip);
    }
  } catch (err) {
    console.log("DB: membership konnte NICHT gelöscht werden");
    res.status(200).json(null);
  }
}
