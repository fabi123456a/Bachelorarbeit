import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

export default async function FS_getSceneByID(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body;
  const jsonObject = JSON.parse(body);

  const filePath = path.join(
    process.cwd(),
    "public",
    "Scenes",
    jsonObject["sceneID"] + ".json"
  );

  fs.readFile(filePath, "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      res.status(200).json({ result: "err: " + filePath });
      return;
    }
    res.status(200).json({ data: jsonString });
  });
}
