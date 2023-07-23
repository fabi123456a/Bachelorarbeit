import { prismaClient } from "../../prismaclient/_prismaClient";

export default async function handler(req, res) {
  const sevenMinutesAgo = new Date(Date.now() - 7 * 60 * 1000);

  try {
    const deletedSceneEdits = await prismaClient.currentSceneEdit.deleteMany({
      where: {
        entryDate: {
          lte: sevenMinutesAgo,
        },
      },
    });

    res.status(200).json(deletedSceneEdits);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
