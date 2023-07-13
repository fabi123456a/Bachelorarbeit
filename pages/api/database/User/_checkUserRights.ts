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
    console.log("request ZUGRIFF VERWEIGERT - keine idUSer angegeben");
    res.status(403).json({ error: "Zugriff verweigert." });
    return false;
  }

  const user: User = await prismaClient.user.findFirst({
    where: {
      id: idUser,
    },
  });

  // if (!user.id) {
  //   console.log("request ZUGRIFF VERWEIGERT - keine rechte");
  //   res.status(403).json({ error: "Zugriff verweigert." });
  //   return false;
  // }

  if (checkAdmin) {
    if (user.isAdmin) {
      console.log("request ZUGRIFF ERLAUBT");
      return true;
    } else {
      console.log("request ZUGRIFF VERWEIGERT - keine rechte");
      res.status(403).json({ error: "Zugriff verweigert." });
      return false;
    }
  }

  if (checkReadonlyUser) {
    if (!user.readOnly || user.isAdmin) {
      console.log("request ZUGRIFF ERLAUBT");
      return true;
    } else {
      console.log("request ZUGRIFF VERWEIGERT - keine rechte");
      res.status(403).json({ error: "Zugriff verweigert." });
      return false;
    }
  }

  if (!user.id) {
    console.log("request ZUGRIFF VERWEIGERT - keine rechte");
    res.status(403).json({ error: "Zugriff verweigert." });
    return false;
  } else {
    console.log("request ZUGRIFF ERLAUBT");
    return true;
  }
}
