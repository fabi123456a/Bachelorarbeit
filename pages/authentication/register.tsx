import { Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { SHA256 } from "crypto-js";
import { User } from "@prisma/client";
import CubeRotater from "../../components/threejs/cubeRotator/cubeRotator";

const Register = (props: { setRegister: (flag: boolean) => void }) => {
  const [txtLoginID, setTxtLoginID] = useState<string>("");
  const [txtPw, setTxtPw] = useState<string>("");

  // funktion, um eine 8 stellige Zahl zu generieren
  function generateEightDigitNumber(): number {
    const min = 10000000; // Die kleinste 8-stellige Zahl (10000000)
    const max = 99999999; // Die größte 8-stellige Zahl (99999999)

    // Generiere eine zufällige Dezimalzahl zwischen 0 (inklusive) und 1 (exklusive)
    const randomDecimal = Math.random();

    // Skaliere und runde die Dezimalzahl, um eine 8-stellige Zahl zu erhalten
    const eightDigitNumber = Math.floor(randomDecimal * (max - min + 1)) + min;

    return eightDigitNumber;
  }

  // funktion, um einen Benutzer mit einer E-Mail in die Datenbank hinzuzufügen + code senden
  const registerUser = async (email: string): Promise<boolean> => {
    const code = generateEightDigitNumber();
    const hashedCode = SHA256(code.toString()).toString();

    // user in db einfügen
    const responseRegister = await fetch("/api/database/User/register", {
      method: "POST",
      body: JSON.stringify({
        email: email.toLowerCase(),
        password: hashedCode,
      }),
    });

    let result: boolean = await responseRegister.json();

    if (!result) {
      alert("Registrieren Fehlgeschlagen.");
      return false;
    }

    // den code senden zum anmelden
    const responseSendCode = await fetch("/api/mail/sendCode", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        code: code,
      }),
    });
    const result1 = await responseSendCode.json();

    if (!result1) return false;
    return true;
  };

  return (
    <Stack
      className="register"
      sx={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src="./logo/Logo-Icon-final.png"
        style={{
          transform: "scale(0.2)",
          position: "absolute",
          zIndex: "-10",
        }}
      ></img>
      <Stack
        sx={{ maxWidth: "350px", minWidth: "350px", background: "white" }}
        className="roundedShadow"
      >
        <Typography variant="h4" sx={{ mb: "24px" }}>
          Registrieren
        </Typography>
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
          sx={{ mt: "24px", background: "#1c8445" }}
          size="large"
          variant="contained"
          onClick={async () => {
            // eingegebene E-Mail prüfen
            if (!txtLoginID) {
              alert("Geben Sie eine E-Mail zum Registrieren an.");
              return;
            }

            // eingegebene E-Mail prüfen
            if (!isEmailValid(txtLoginID)) {
              alert("Geben sie eine gültige E-Mail an.");
              return;
            }

            // versuchen, E-Mail/Benutzer in die Datenbank eintragen
            const registeredUser: boolean = await registerUser(txtLoginID);

            // prüfen ob das hinzufügen in die Datenbank funktioniert hat
            if (!registeredUser) {
              alert("Registrieren fehlgeschlagen");
              return;
            } else {
              alert(
                "Wir haben Ihnen eine E-Mail mit einem Anmeldepasswort gesendet. Bitte überprüfen Sie Ihr Postfach und verwenden Sie das erhaltenen Passwort, um sich anzumelden."
              );
              props.setRegister(false);
            }
          }}
        >
          Registrieren
        </Button>
        <Button
          sx={{ color: "#1c8445" }}
          onClick={() => {
            props.setRegister(false);
          }}
        >
          Zurück
        </Button>
      </Stack>
      <CubeRotater></CubeRotater>
    </Stack>
  );
};

// E-Mail mit regex prüfen
export function isEmailValid(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  return emailRegex.test(email);
}

export default Register;
