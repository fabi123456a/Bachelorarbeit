import { Model, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../prismaclient/_prismaClient";
import { checkSessionID } from "../Session/_checkSessionID";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const flag = await checkSessionID(req, res);
  if (!flag) return;
  
  const b = req.body;
  const requestData = JSON.parse(b);
  const idScene = requestData["idScene"];

  try {
    const deletedModels = await prismaClient.model.deleteMany({
      where: {
        idScene: idScene,
      },
    });
    console.error("DB: models mit der idScene" + idScene + " wurden gelöscht ");
    res.status(200).json(deletedModels);
  } catch (error) {
    console.error(
      "DB: Models mit einer idScene " +
        idScene +
        " löschen hat nicht funktioniert."
    );
    res.status(500).json(null);
  }
}
