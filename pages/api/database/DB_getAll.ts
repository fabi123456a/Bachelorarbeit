import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../prismaclient/_prismaClient";

export default async function DB_getAll(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const requestBody = JSON.parse(req.body);
  const tableName = requestBody["tableName"];

  try {
    if (typeof tableName === "string") {
      const data: any[] = await prismaClient[tableName].findMany();
      console.log("DATA: " + data + ", " + tableName);

      res.status(200).json(data);
    }
  } catch (error) {
    console.error(error);
    res.status(200).json(null);
  }
}
