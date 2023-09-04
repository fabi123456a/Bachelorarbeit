// pages/_app.js
import "./globals.css";
import { MutableRefObject, useEffect, useState } from "react";

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
