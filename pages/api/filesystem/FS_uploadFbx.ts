//https://www.youtube.com/watch?v=QTD9L0jL0dU

import { NextApiHandler, NextApiRequest } from "next";
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";

export const config = {
  api: {
    bodyParser: false,
  },
};

// const
const fbxFolderPath = "/public/ModelsFBX";

const readFile = (
  req: NextApiRequest,
  saveLocally?: boolean
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {};

  if (saveLocally) {
    // upload pfad festlegen
    options.uploadDir = path.join(process.cwd(), fbxFolderPath);

    // dateiname erstellen
    options.filename = (name, ext, path, form) => {
      return path.originalFilename;
    };
  }

  // max file size setzen
  options.maxFileSize = 4000 * 1024 * 1024;

  const form = formidable(options);

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

const handler: NextApiHandler = async (req, res) => {
  // let form1 = formidable();
  // form1.parse(req, (err, fields, files) => {
  //   const sessionID = fields.sessionID;
  //   const idUser = fields.idUser;
  //   console.log("sessionID: ", sessionID);
  //   console.log("idUser: ", idUser);
  // });

  try {
    await fs.readdir(path.join(process.cwd() + "/public", "/ModelsFBX"));
  } catch (error) {
    await fs.mkdir(path.join(process.cwd() + "/public", "/ModelsFBX"));
  }
  await readFile(req, true);
  res.json({ done: "ok" });
};

export default handler;
