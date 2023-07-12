import { Model, PrismaClient } from "@prisma/client";
import { prismaClient } from "../../prismaclient/_prismaClient";
import { checkSessionID } from "../Session/_checkSessionID";

export default async function handler(req, res) {
  const flag = await checkSessionID(req, res);
  if (!flag) return;

  try {
    const b = req.body;
    const requestData = JSON.parse(b);
    const model = requestData["model"];
    // const model = req.body as Model;

    const createdModel = await prismaClient.model.create({
      data: {
        id: model.id,
        idScene: model.idScene,
        positionX: model.positionX,
        positionY: model.positionY,
        positionZ: model.positionZ,
        scaleX: model.scaleX,
        scaleY: model.scaleY,
        scaleZ: model.scaleZ,
        rotationX: model.rotationX,
        rotationY: model.rotationY,
        rotationZ: model.rotationZ,
        visibleInOtherPerspective: model.visibleInOtherPerspective,
        showXTransform: model.showXTransform,
        showYTransform: model.showYTransform,
        showZTransform: model.showZTransform,
        texture: model.texture,
        color: model.color,
        name: model.name,
        info: model.info,
        modelPath: model.modelPath,
        version: model.version,
      },
    });

    console.error("DB: Model hinzugefügt.");
    res.status(200).json(createdModel);
  } catch (error) {
    console.error("DB: Model hinzufügen hat nicht funktioniert.");
    console.error(error);
    res.status(500).json(null);
  }
}
