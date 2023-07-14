import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../prismaclient/_prismaClient";

export default async function checkUserRights(
  idUser: string,
  action: "select" | "create" | "update" | "delete"
) {
  if (!idUser) {
    console.log(
      "\x1b[31m%s\x1b[0m",
      "request ZUGRIFF VERWEIGERT - ungültige idUser"
    );
    return false;
  }

  const user: User = await prismaClient.user.findFirst({
    where: {
      id: idUser,
    },
  });

  if (!user) {
    console.log(
      "\x1b[31m%s\x1b[0m",
      "request ZUGRIFF VERWEIGERT - ungültige idUser"
    );
    return false;
  }

  switch (action) {
    case "select":
      return user.read;
    case "create":
      return user.write;
    case "update":
      return user.write;
    case "delete":
      return user.delete;
    default:
      return false;
  }
}
