import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../prismaclient/_prismaClient";
import { Model, User } from "@prisma/client";
import { checkSessionID } from "../Session/_checkSessionID";

export default async function DB_getAllModelsByID(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const flag = await checkSessionID(req, res);
  if (!flag) return;

  const b = req.body;
  const requestData = JSON.parse(b);
  const idScene = requestData["idScene"];
  const version = requestData["version"];

  const models: Model[] = await prismaClient.model.findMany({
    where: { idScene: idScene, version: version },
  });

  if (models == null) {
    console.log("DB: find models " + models.length);
    res.status(200).json(models);
  } else {
    console.log("DB: no models find with idScene " + idScene);
    res.status(200).json(models);
  }
}
