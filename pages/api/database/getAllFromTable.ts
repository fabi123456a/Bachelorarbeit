import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../prismaclient/_prismaClient";

export default async function getAllFromTable(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const text = "Hallo, dies ist eine API-Antwort mit Textinhalt.";

  try {
    const users: User[] = await prismaClient.user.findMany();
    res.status(200).send(text);
    return;
  } catch (error) {
    throw new Error("Benutzer konnten nicht abgerufen werden.");
  }
}
