import sendEmail from "../../../mailService/sendEmail";
import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../prismaclient/_prismaClient";
import { SHA256 } from "crypto-js";

const generatePassword = require("generate-password");

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const b = req.body;
  const requestData = JSON.parse(b);
  const email: string = requestData["email"];
  const code: string = requestData["code"];

  sendEmail(
    email,
    "Passwort zum anmelden",
    "Ihr  Passwort lautet " +
      code +
      ". Sie können das Passwort in den Einstellungen jederzeit ändern."
  );
};

export default handler;
