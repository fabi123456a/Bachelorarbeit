import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../prismaclient/_prismaClient";

// fügt einen neuen user in die database ein
// wenn es funktioniert hat, wird das user object zurückgeliefert ansonsten NULL
export default async function DB_insertMemberShip(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const b = req.body;
  const requestData = JSON.parse(b);
  const idScene = requestData["idScene"];
  const idUser = requestData["idUser"];
  const readOnly = requestData["readonly"];

  try {
    const memberShip = await prismaClient.sceneMemberShip.create({
      data: {
        id: randomUUID(),
        idScene: idScene,
        idUser: idUser,
        entryDate: new Date(),
        readOnly: readOnly,
      },
    });

    if (memberShip) {
      console.log(
        "DB: insert membership idUSer: " + idUser + ", idScene: " + idScene
      );
      res.status(200).json(memberShip);
    }
  } catch (err) {
    console.log("DB: membership konnte NICHT hinzugefügt werden");
    res.status(200).json(null);
  }
}
