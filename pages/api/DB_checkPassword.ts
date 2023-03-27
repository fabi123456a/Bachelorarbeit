import { NextApiRequest, NextApiResponse } from "next";
import { ModelUser } from "./_models";
import { prismaClient } from "./_prismaClient";

type Session= {
  id: string,
  user: string,
}

let sessions=new Map<string, Session>();

export default async function DB_checkPassword(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const pw = req.query.pw as string;
  const user = req.query.user as string;

  const selectedUser: ModelUser = await prismaClient.user.findFirst({
    where: {
      AND: [{ loginID: user }, { password: pw }],
    },
  });

  if (selectedUser == null) res.status(200).json(null);
  else {
    res.status(200).json(selectedUser);
  }
}
