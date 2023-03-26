import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

export default async function FS_getFbxModels(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const modelsFbxFolder = "/public/ModelsFBX/";
  const fbxFilenames: Array<string> = new Array<string>();

  fs.readdirSync(path.join(process.cwd() + modelsFbxFolder)).forEach(
    (filename: string) => {
      if (filename[0] != ".") fbxFilenames.push(filename);
    }
  );

  res.status(200).json({ files: fbxFilenames });
}
