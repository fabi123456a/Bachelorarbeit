import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../prismaclient/_prismaClient";
import { checkSessionID } from "../Session/_checkSessionID";

export default async function DB_insertMemberShip(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const flag = await checkSessionID(req, res);
  if (!flag) return;

  const b = req.body;
  const requestData = JSON.parse(b);
  const idScene = requestData["idScene"];
  const idUser = requestData["idUser"];

  try {
    const memberShip = await prismaClient.sceneMemberShip.findFirst({
      where: {
        idUser: idUser,
        idScene: idScene,
      },
    });

    if (memberShip) {
      console.log(
        "DB: find membership idUser: " + idUser + ", und idScene: " + idScene
      );
      res.status(200).json(memberShip);
    }
  } catch (err) {
    console.log(
      "DB: membership by idIser und idScene konnte NICHT geladen werden"
    );
    res.status(200).json(null);
  }
}
