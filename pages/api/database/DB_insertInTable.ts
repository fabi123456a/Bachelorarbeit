import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../prismaclient/_prismaClient";
import { checkSessionID } from "./Session/_checkSessionID";
import checkUserRights from "./User/_checkUserRights";

export default async function DB_insertInTable(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const flag = await checkSessionID(req, res);
  if (!flag) return;

  const rights = await checkUserRights(req, res, true, false);
  if (!rights) return;

  const requestBody = JSON.parse(req.body);
  const tableName = requestBody["tableName"];
  const data1 = requestBody["data"]; // soll ein oibject sein {id: "sjfios", loginID. "sdaf", ...}

  try {
    if (typeof tableName === "string") {
      const data: any[] = await prismaClient[tableName].create({
        data: data1,
      });
      console.log("DB_INSERT: create: " + data1);

      res.status(200).json(data);
    }
  } catch (error) {
    console.error(error);
    res.status(200).json(null);
  }
}
