import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../prismaclient/_prismaClient";
import { checkSessionID } from "./Session/_checkSessionID";
import checkUserRights from "./User/_checkUserRights";

export default async function DB_getAll(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const flag = await checkSessionID(req, res);
  if (!flag) return;

  const rights = await checkUserRights(req, res, true, false);
  if (!rights) return;

  const requestBody = JSON.parse(req.body);
  const tableName = requestBody["tableName"];
  const orderBy = requestBody["orderBy"];

  try {
    if (!orderBy) {
      if (typeof tableName === "string") {
        const data: any[] = await prismaClient[tableName].findMany();
        console.log("DB_SELECT -> findMany from: " + tableName);

        res.status(200).json(data);
      }
    } else {
      if (typeof tableName === "string") {
        const data: any[] = await prismaClient[tableName].findMany({
          orderBy: {
            [orderBy]: "asc", // asc aufsteigende Reihenfolge
          },
        });
        console.log(
          "DB_SELECT + ORDERBY " + orderBy + " -> findMany from: " + tableName
        );

        res.status(200).json(data);
      }
    }
  } catch (error) {
    console.error(error);
    res.status(200).json(null);
  }
}
