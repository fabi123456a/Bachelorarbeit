import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

export default async function FS_getAllSceneNames(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let pathToFolder = path.join(process.cwd(), "public", "Scenes");

  fs.readdir(pathToFolder, (err, files) => {
    if (err) {
      console.log(err);
      res.status(200).json({ result: "fehler beim laden der scene names" });
    } else {
      console.log("erfolgreich alle naem geladen");
      res.status(200).json({ result: files });
    }
  })
}
