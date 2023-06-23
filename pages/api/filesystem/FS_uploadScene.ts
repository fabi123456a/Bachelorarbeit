import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

export default async function FS_uploadScene(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body;
  const jsonObject = JSON.parse(body);

  console.log("FS_uploadScene \n\n" + JSON.stringify(jsonObject));

  const filePath = path.join(
    process.cwd(),
    "public",
    "Scenes",
    jsonObject["sceneID"] + ".json"
  );

  fs.writeFileSync(filePath, jsonObject["jsonData"]); // TODO

  res.status(200).json({ result: jsonObject["sceneID"] });
}
