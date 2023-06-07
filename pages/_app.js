import { SessionProvider } from "next-auth/react";
// pages/_app.js
import "./globals.css";

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
