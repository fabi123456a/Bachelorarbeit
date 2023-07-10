import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../prismaclient/_prismaClient";
import { SceneMemberShip } from "@prisma/client";
import Scene from "../../../threejs/Scene/Scene";

// fügt einen neuen user in die database ein
// wenn es funktioniert hat, wird das user object zurückgeliefert ansonsten NULL
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const b = req.body;
  const requestData = JSON.parse(b);
  const idUser = requestData["idUser"];

  try {
    const memberships: SceneMemberShip[] =
      await prismaClient.sceneMemberShip.findMany({
        where: {
          idUser: idUser,
        },
        include: {
          scene: true,
        },
      });

    if (memberships) {
      console.log("DB: scene members ships von idUSer " + idUser + " geladen");
      console.log(memberships);
      res.status(200).json(memberships);
    }
  } catch (err) {
    console.log(
      "DB: memberships mit der von idUser " +
        idUser +
        " konnte NICHT geladen werden"
    );
    console.log(err);
    res.status(200).json(null);
  }
}