import "@picocss/pico";
import "@/style/globals.css";
import "@/style/theme.css";

import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { DEVELOPER, GOOGLE_ADSENSE, GOOGLE_ANALYITICS } from "@/constants/ENV";
import { META_DATA } from "@/constants/META_DATA";

export const metadata = META_DATA;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kor">
      <head>
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${GOOGLE_ADSENSE}`}
          crossOrigin="anonymous"></Script>
      </head>
      <body>
        <header>
          <nav>
            <h1>
              Ins
              <strong className="text-pico-primary-background">tool</strong>
              gram
            </h1>
            <a href={DEVELOPER}>made by Seondal</a>
          </nav>
        </header>
        <main className="">{children}</main>
        <GoogleAnalytics gaId={GOOGLE_ANALYITICS} />
        <footer className="text-center p-4"></footer>
      </body>
    </html>
  );
}