import { Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { SHA256 } from "crypto-js";
import { User } from "@prisma/client";
import CubeRotater from "../../components/threejs/cubeRotator/cubeRotator";

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

  const registerUser = async (email: string): Promise<boolean> => {
    const code = generateEightDigitNumber();
    const hashedCode = SHA256(code.toString()).toString();

    // email in db einfügen
    const response = await fetch("/api/database/User/register", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: hashedCode,
      }),
    });

    let result: boolean;
    try {
      result = await response.json();
    } catch (e) {
      // alert(e);
      return;
    }

    if (!result) {
      alert("Registrieren Fehlgeschlagen.");
      return;
    }

    // den code senden zum anmelden
    const response1 = await fetch("/api/mail/sendCode", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        code: code,
      }),
    });
    const result1 = await response1.json();

    if (!result1) return;
    return result1;
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
        }}
      ></img>
      <Stack
        sx={{ maxWidth: "40%", minWidth: "40%" }}
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
            if (!txtLoginID) {
              alert("Geben Sie eine E-Mail zum Registrieren an.");
              return;
            }

            if (!txtLoginID.includes("@")) {
              alert("Geben sie eine gültige E-Mail an.");
              return;
            }

            const registeredUser: boolean = await registerUser(txtLoginID);

            if (!registeredUser) {
              alert("Registrieren fehlgeschlagen");
              return;
            } else {
              alert(
                "Wir senden ihnen eine E-Mail mit einem Paswort zum anmelden gesendet. Sie werden nun zum Login weitergeleitet."
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

export default Register;
