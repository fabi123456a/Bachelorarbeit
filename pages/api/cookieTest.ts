import { NextApiRequest, NextApiResponse } from "next";

let sessions = new Map<string, string>();

export default async function cookieTest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const sessionidCookie = req.cookies.sessionID;

  if (sessionidCookie) {
    return res
      .status(200)
      .json({ message: "Session-ID gefunden", sessionId: sessionidCookie });
  }
  return res.status(400).json({ message: "Kein Session-ID-Cookie gefunden" });
}
