import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";
import { checkSessionID } from "../database/Session/_checkSessionID";

export default async function FS_getFbxModels(
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
  const fbxFilenames: Array<string> = new Array<string>();
  try {
    fs.readdirSync(path.join(process.cwd() + modelsFbxFolder)).forEach(
      (filename: string) => {
        if (filename[0] != ".") fbxFilenames.push(filename);
      }
    );

    res.status(200).json({ files: fbxFilenames });
    console.log("FILESYSTEM -> getFbxModels");
  } catch (error) {
    console.log(error);
    res.send(null);
  }
}
