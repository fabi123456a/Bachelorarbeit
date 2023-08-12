import { Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { SHA256 } from "crypto-js";
import { User } from "@prisma/client";

const Register = (props: { setRegister: (flag: boolean) => void }) => {
  const [txtLoginID, setTxtLoginID] = useState<string>("");
  const [txtPw, setTxtPw] = useState<string>("");

  function generateEightDigitNumber(): number {
    const min = 10000000; // Die kleinste 8-stellige Zahl (10000000)
    const max = 99999999; // Die größte 8-stellige Zahl (99999999)

    // Generiere eine zufällige Dezimalzahl zwischen 0 (inklusive) und 1 (exklusive)
    const randomDecimal = Math.random();

    // Skaliere und runde die Dezimalzahl, um eine 8-stellige Zahl zu erhalten
    const eightDigitNumber = Math.floor(randomDecimal * (max - min + 1)) + min;

    return eightDigitNumber;
  }

  const handleBtnRegisterClick = async (
    email: string,
    pw: string
  ): Promise<User> => {
    const code = generateEightDigitNumber();
    const hashedCode = SHA256(code.toString()).toString();

    alert(code + ", " + hashedCode);

    // email in db einfügen
    const response = await fetch("/api/database/User/register", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: hashedCode,
      }),
    });

    // den code senden zum anmelden
    const response1 = await fetch("/api/mail/sendCode", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        code: code,
      }),
    });
    const result1 = await response1.json();

    const result = await response.json();
    return result;
  };

  return (
    <Stack className="register">
      <Typography variant="h1">Registrieren</Typography>
      <TextField
        label={"E-Mail"}
        variant="filled"
        onChange={(event) => {
          setTxtLoginID(event.target.value);
        }}
        value={txtLoginID}
      ></TextField>
      {/* <TextField
        label={"Passwort"}
        variant="filled"
        onChange={(event) => {
          setTxtPw(event.target.value);
        }}
        value={txtPw}
      ></TextField> */}
      <Button
        sx={{ mt: "24px" }}
        size="large"
        variant="contained"
        onClick={async () => {
          if (!txtLoginID) {
            alert("Geben Sie eine E-Mail zum Registrieren an.");
            return;
          }
          const registeredUser: User = await handleBtnRegisterClick(
            txtLoginID,
            txtPw
          );

          if (!registeredUser) {
            alert("Registrierung fehlgeschlagen");
            return;
          } else {
            alert(
              "Wir haben ihnen eine E-Mail Adresse mit einem Paswwort gesendet."
            );
            props.setRegister(false);
          }
        }}
      >
        Registrieren
      </Button>
      <Button
        onClick={() => {
          props.setRegister(false);
        }}
      >
        Zurück
      </Button>
    </Stack>
  );
};

export default Register;
