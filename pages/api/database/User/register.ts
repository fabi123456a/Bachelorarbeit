import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../prismaclient/_prismaClient";

export default async function register(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //   const { loginID, password } = req.body;
  const b = req.body;
  const requestData = JSON.parse(b);
  const loginID = requestData["loginID"];
  const password = requestData["password"];

  console.log("REGISTER_TRY: " + loginID + ", " + password);

  try {
    const registerUser = await prismaClient.user.create({
      data: {
        id: crypto.randomUUID(),
        loginID: loginID,
        password: password,
        isAdmin: false,
        read: true,
        write: true,
        delete: false,
      },
    });
    console.log("REGISTER => " + loginID);
    res.send(registerUser);
  } catch (e) {
    console.log("Registrieren fehlgeschlagen.");
    res.send(null);
  }
}
