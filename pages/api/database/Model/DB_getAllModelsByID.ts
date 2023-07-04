import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../prismaclient/_prismaClient";
import { Model, User } from "@prisma/client";

export default async function DB_getAllModelsByID(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const b = req.body;
  const requestData = JSON.parse(b);

  const idScene = requestData["idScene"];

  const models: Model[] = await prismaClient.model.findMany({
    where: { idScene: idScene },
  });

  if (models == null) {
    console.log("DB: find models " + models.length);
    res.status(200).json(models);
  } else {
    console.log("DB: no models find with idScene " + idScene);
    res.status(200).json(models);
  }
}
