import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../prismaclient/_prismaClient";

export default async function DB_deleteOldSessions(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const requestData = JSON.parse(req.body);
  const idScene = requestData["idScene"];

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
