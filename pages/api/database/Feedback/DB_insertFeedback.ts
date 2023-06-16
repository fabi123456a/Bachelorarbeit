import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../prismaclient/_prismaClient";

// fügt einen neuen user in die database ein
// wenn es funktioniert hat, wird das user object zurückgeliefert ansonsten NULL
export default async function DB_insertFeedback(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const b = req.body;
  const requestData = JSON.parse(b);

  try {
    const feedback = await prismaClient.feedback.create({
      data: {
        id: randomUUID(),
        text: requestData["text"],
      },
    });

    res.status(200).json(feedback);
  } catch (err) {
    res.status(200).json(null);
  }
}
