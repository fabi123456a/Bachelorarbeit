import { NextApiRequest, NextApiResponse } from "next";

import { ModelScene } from "./_models";
import { prismaClient } from "./_prismaClient";

export default async function DB_insertScene(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const b = req.body;
  const requestData = JSON.parse(b);

  const result: ModelScene[] = await prismaClient.scene.findMany({
    where: { id: requestData["id"] },
  });

  if (result == null) res.status(200).json({ result: false });
  else {
    res.status(200).json({ result: result[0] });
  }
}

// hilf fkt
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
