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
  const flag = await checkSessionID(req, res);
  if (!flag) return;

  const rights = await checkUserRights(req, res, true, false);
  if (!rights) return;

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
