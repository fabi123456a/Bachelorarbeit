import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { checkSessionID } from "../database/Session/_checkSessionID";

export default async function handler(
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
