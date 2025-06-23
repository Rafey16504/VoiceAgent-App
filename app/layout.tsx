import "@livekit/components-styles";
import { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import ClientWrapper from "./client-wrapper";

const publicSans400 = Public_Sans({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Voice Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full ${publicSans400.className}`}>
      <body className="h-screen">
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
