import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthContextProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <Toaster />
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}
