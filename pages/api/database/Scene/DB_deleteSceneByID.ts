import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../prismaclient/_prismaClient";
import { checkSessionID } from "../Session/_checkSessionID";

export default async function DB_deleteOldSessions(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const flag = await checkSessionID(req, res);
  if (!flag) return;

  const requestData = JSON.parse(req.body);
  const idScene = requestData["idScene"];

  // erst alle models der scene löschen in SCeneModel
  const deleteModels = await prismaClient.model.deleteMany({
    where: { idScene: idScene },
  });

  // dann Memberships löschen
  const deleteMemberships = await prismaClient.sceneMemberShip.deleteMany({
    where: { idScene: idScene },
  });

  // dann die scene löschen
  const ergDelete = await prismaClient.scene.deleteMany({
    where: {
      id: idScene,
    },
  });

  if (ergDelete.count > 0) {
    console.log("Es wurde(n) " + ergDelete.count + " Zeile(n) gelöscht.");
    res.send(ergDelete.count);
  } else {
    console.log("es wurde keine Scene mit der ID: " + idScene + " gelöscht");
    res.send(ergDelete.count);
  }
}
