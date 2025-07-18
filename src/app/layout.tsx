import "@picocss/pico";
import "@/style/globals.css";
import "@/style/theme.css";

import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import {
  DEVELOPER,
  FORM,
  GOOGLE_ADSENSE,
  GOOGLE_ANALYITICS,
} from "@/constants/env";
import { META_DATA } from "@/constants/META_DATA";
import Link from "next/link";

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
            <ul>
              <h1>
                Ins
                <strong className="text-pico-primary-background">tool</strong>
                gram
              </h1>
            </ul>
            <ul>
              <li>
                <Link href="/">릴스</Link>
              </li>
              <li>
                <Link href="/story">하이라이트</Link>
              </li>
              <li>
                <Link href={DEVELOPER} className="text-xs">
                  made by Seondal
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        <main className="">{children}</main>
        <GoogleAnalytics gaId={GOOGLE_ANALYITICS} debugMode />
        <footer>
          <div className="text-xs mb-4">
            본 웹사이트는 합법적인 용도로만 사용해야 하며, 모든 콘텐츠의
            저작권은 해당 권리자에게 있습니다. 사용자가 본 서비스를 이용하여
            저작권을 침해하는 경우, 그에 대한 모든 책임은 사용자 본인에게
            있습니다.
          </div>
          {/* <a href="https://buymeacoffee.com/seondal">Buy me a coffee</a> */}
          <a href={FORM}>서비스에 대한 의견을 남겨주세요!</a>
        </footer>
      </body>
    </html>
  );
}
