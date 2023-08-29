import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../prismaclient/_prismaClient";

export default async function register(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //   const { loginID, password } = req.body;
  const b = req.body;
  const requestData = JSON.parse(b);
  const loginID: string = requestData["email"];
  const password = requestData["password"];

  console.log("REGISTER_TRY: " + loginID + ", " + password);

  try {
    const registerUser = await prismaClient.user.create({
      data: {
        id: crypto.randomUUID(),
        email: loginID,
        password: password,
        isAdmin: false,
        read: true,
        write: true,
        delete: false,
        displayName: loginID.split("@")[0],
      },
    });
    console.log("REGISTER => " + loginID);
    res.send(true);
  } catch (e) {
    console.log("Registrieren fehlgeschlagen.");
    res.send(null);
  }
}
