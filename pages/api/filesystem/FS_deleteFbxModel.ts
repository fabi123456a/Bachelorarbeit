import { PrismaClient, User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";
import { checkSessionID } from "../database/Session/_checkSessionID";
import { prismaClient } from "../prismaclient/_prismaClient";
import checkUserRights from "../database/User/_checkUserRights";

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

  const modelsFbxFolder = "/public/ModelsFBX/";
  const requestBody = JSON.parse(req.body);
  const fbxModel = requestBody["fbxModel"];
  const deletePath = path.join(process.cwd(), modelsFbxFolder, fbxModel);

  try {
    fs.unlinkSync(deletePath);
    console.log("FILESYSTEM -> delete FBX-Model: " + fbxModel);
    res.status(200).json(true);
  } catch (error) {
    console.log(error);
    res.status(200).json(false);
  }
}
