import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

export default async function FS_deleteFbxModel(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
    res.status(500).json(null);
  }
}
