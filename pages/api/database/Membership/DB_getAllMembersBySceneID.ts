import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../prismaclient/_prismaClient";
import { SceneMemberShip } from "@prisma/client";
import Scene from "../../../threejs/Scene/Scene";
import { checkSessionID } from "../Session/_checkSessionID";
import checkUserRights from "../User/_checkUserRights";

// fügt einen neuen user in die database ein
// wenn es funktioniert hat, wird das user object zurückgeliefert ansonsten NULL
export default async function DB_getAllMembersBySceneID(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const flag = await checkSessionID(req, res);
  if (!flag) return;

  const rights = await checkUserRights(req, res, false, false);
  if (!rights) return;

  const b = req.body;
  const requestData = JSON.parse(b);
  const idScene = requestData["idScene"];

  try {
    const members: SceneMemberShip[] =
      await prismaClient.sceneMemberShip.findMany({
        where: {
          idScene: idScene,
        },
        include: {
          user: true,
        },
      });

    if (members) {
      console.log("DB: scene members der Scene geladen " + idScene);
      res.status(200).json(members);
    }
  } catch (err) {
    console.log(
      "DB: memberships mit der sceneID " +
        idScene +
        " konnte NICHT hinzugefügt werden"
    );
    res.status(200).json(null);
  }
}
