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
  const id = requestBody["id"];
  const prop = requestBody["prop"];
  const newData = requestBody["newData"];
  const tableName = requestBody["tableName"];

  try {
    const data: any[] = await prismaClient[tableName].update({
      where: { id: id },
      data: { [prop]: newData },
    });

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(200).json(null);
  }
}
