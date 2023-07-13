import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../prismaclient/_prismaClient";
import { checkSessionID } from "../Session/_checkSessionID";
import checkUserRights from "../User/_checkUserRights";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const flag = await checkSessionID(req, res);
  if (!flag) return;

  const rights = await checkUserRights(req, res, false, true);
  if (!rights) return;

  const b = req.body;
  const requestData = JSON.parse(b);
  const id = requestData["id"];
  const readonly = requestData["readonly"];

  try {
    const changeMemberShip = await prismaClient.sceneMemberShip.update({
      where: { id: id },
      data: { readOnly: readonly },
    });

    if (changeMemberShip) {
      console.log("DB: memebrship readonly von id geändert " + id);
      res.status(200).json(changeMemberShip);
    }
  } catch (err) {
    console.log("DB: membership konnte geupdated werden");
    res.status(200).json(null);
  }
}
