import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const texturesFolderPath = path.join(process.cwd(), "public", "textures");

  try {
    // Lese alle Dateien und Ordner im Textures-Ordner
    const folderNames: string[] = fs
      .readdirSync(texturesFolderPath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    res.status(200).json(folderNames);
  } catch (error) {
    res.status(500).json(null);
  }
}
