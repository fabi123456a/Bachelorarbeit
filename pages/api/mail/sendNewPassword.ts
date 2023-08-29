import sendEmail from "../../../mailService/sendEmail";
import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../prismaclient/_prismaClient";
import { SHA256 } from "crypto-js";

const generatePassword = require("generate-password");

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const b = req.body;
  const requestData = JSON.parse(b);
  const email: string = requestData["email"];

  // Erzeuge ein zufälliges Passwort
  const newPassword = generatePassword.generate({
    length: 12, // Länge des Passworts
    numbers: true, // Enthält Zahlen
    symbols: false, // Enthält Sonderzeichen
    uppercase: true, // Enthält Großbuchstaben
    excludeSimilarCharacters: true, // Vermeide ähnliche Zeichen wie l und 1, o und 0, usw.
  });

  const hashedPw = SHA256(newPassword).toString();
  try {
    await prismaClient.user.update({
      where: { email: email },
      data: { password: hashedPw },
    });

    sendEmail(
      email,
      "Neues Passwort",
      "Ihr neues Passwort lautet: " +
        newPassword +
        ". Sie können das Passwort in den Einstellungen wieder ändern."
    );

    res.send(true);
  } catch (e) {
    console.log(e);
    res.send(false);
  }
};

export default handler;
