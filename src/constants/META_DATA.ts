import { Metadata } from "next";
import { GOOGLE_ADSENSE, GOOGLE_SEARCH, NAVER_SEARCH } from "./env";

export const META_DATA: Metadata = {
  title: {
    default: `Instoolgram`,
    template: `Instoolgram | %s`,
  },
  description: "인스타그램 릴스 다운로드",
  openGraph: {
    title: "Instoolgram",
    description: "인스타그램 릴스 다운로드",
    // images: ["/meta/og.png"],
  },
  icons: {
    icon: "/meta/favicon.ico",
    apple: "/meta/favicon.ico",
  },
  verification: {
    google: GOOGLE_SEARCH,
  },
  other: {
    "naver-site-verification": NAVER_SEARCH,
    "google-adsense-account": GOOGLE_ADSENSE,
  },
};
