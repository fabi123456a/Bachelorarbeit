import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

export default async function FS_deleteFbxModel(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
    res.status(500).json(null);
  }
}
