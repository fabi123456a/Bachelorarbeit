import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../prismaclient/_prismaClient";

export default async function checkUserRights(
  req: NextApiRequest,
  res: NextApiResponse,
  checkAdmin: boolean, // immer nur eins auf true setzen!
  checkReadonlyUser: boolean
) {
  const requestBody = JSON.parse(req.body);
  const idUser = requestBody["idUser"];

  if (!idUser) {
    console.log("request ZUGRIFF VERWEIGERT");
    res.status(403).json({ error: "Zugriff verweigert." });
    return false;
  }

  const user: User = await prismaClient.user.findFirst({
    where: {
      id: idUser,
    },
  });

  if (checkAdmin) {
    if (user.isAdmin) {
      console.log("request ZUGRIFF ERLAUBT");
      return true;
    } else {
      console.log("request ZUGRIFF VERWEIGERT");
      res.status(403).json({ error: "Zugriff verweigert." });
      return false;
    }
  }

  if (checkReadonlyUser) {
    if (!user.readOnly) {
      console.log("request ZUGRIFF ERLAUBT");
      return true;
    } else {
      console.log("request ZUGRIFF VERWEIGERT");
      res.status(403).json({ error: "Zugriff verweigert." });
      return false;
    }
  }
}
