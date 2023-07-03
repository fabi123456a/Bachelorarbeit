import { NextApiRequest, NextApiResponse } from "next";
import { checkSessionID } from "../Session/_checkSessionID";
import { Scene } from "@prisma/client";
import { prismaClient } from "../../prismaclient/_prismaClient";

export default async function DB_getAllSceneNames(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const requestBody = JSON.parse(req.body);
  const idUser = requestBody["id"];

  // const sessionID = req.cookies.sessionID;

  // const session = await checkSessionID(sessionID);

  // if (session) {
  //   const scenes: Scenes[] = await prismaClient.scenes.findMany();

  //   if (scenes == null)
  //     res.status(200).json({ result: "fehler beim laden der Scenes" });
  //   else {
  //     res.status(200).json(scenes);
  //   }
  // } else {
  //   console.log("ungültige Session ID: " + sessionID);
  //   res.status(200).json(null);
  // }

  let scenes: Scene[];

  console.log("...... " + idUser);

  if (idUser) {
    scenes = await prismaClient.scene.findMany({
      where: {
        idUserCreater: { equals: idUser },
      },
    });

    console.log("...... " + scenes.length);
  } else {
    scenes = await prismaClient.scene.findMany();
    console.log("...z.z.z. " + scenes.length);
  }

  if (scenes == null) res.status(200).json(null);
  else {
    res.status(200).json(scenes);
  }
}
