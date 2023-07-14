import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";
import checkUserRights from "../database/User/_checkUserRights";
import { checkSessionID } from "../database/Session/_checkSessionID";

export default async function FS_deleteFbxModel(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const b = req.body;
  const requestData = JSON.parse(b);
  const sessionID = requestData["sessionID"];

  const check = await checkSessionID(sessionID);
  if (!check) {
    res.status(403).json({
      error:
        "Zugriff verweigert: Der Nutzer hat keine Rechte für diese Aktion.",
    });
    return;
  }

  const tetxtureFolder = "/public/textures/";
  const requestBody = JSON.parse(req.body);
  const texture = requestBody["textureName"];
  const deletePath = path.join(process.cwd(), tetxtureFolder, texture);

  try {
    fs.rmSync(deletePath, { recursive: true, force: true });
    console.log("FILESYSTEM -> delete tetxure: " + texture);
    res.status(200).json(true);
  } catch (error) {
    console.log(error);
    res.status(200).json(false);
  }
}
