import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../prismaclient/_prismaClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const requestData = JSON.parse(req.body);
  const idScene = requestData["idScene"];
  const version = requestData["version"];

  try {
    const updatedScene = await prismaClient.scene.update({
      where: { id: idScene },
      data: { newestVersion: version },
    });

    res.status(200).json(updatedScene);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}