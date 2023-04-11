import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

export default async function FS_getSceneByID(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const jsonObject = JSON.parse(req.body);
  const idScene = jsonObject["idScene"];

  const filePath = path.join(
    process.cwd(),
    "public",
    "Scenes",
    idScene + ".json"
  );

  //   fs.readFile(filePath, "utf8", (err, jsonString) => {
  //     if (err) {
  //       console.log("File read failed:", err);
  //       res.status(200).json({ result: "err: " + filePath });
  //       return;
  //     }
  //     res.status(200).json({ data: jsonString });
  //   });

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      res.send("error beim löschenb");
      return;
    }

    res.send("yeah");
    console.log("Die Datei wurde erfolgreich gelöscht");
  });
}
