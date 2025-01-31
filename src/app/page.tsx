"use client";

import copyToClipboard from "@/utils/copyToClipboard";
import { sendGAEvent } from "@next/third-parties/google";
import { FormEvent, useState } from "react";

const MAGIC_STRING = "?__a=1&__d=dis" as const;

function getRefinedUrl(url: string) {
  const splitted = url.split("/");

  if (
    splitted[0] !== "https:" ||
    splitted[1] !== "" ||
    splitted[2] !== "www.instagram.com"
  ) {
    return "NOT_VALID_URL";
  }

  if (splitted[3] !== "reel" || typeof splitted[4] !== "string") {
    return "NOT_REEL";
  }

  const refined_url = "https://www.instagram.com/reel/" + splitted[4];

  return refined_url;
}

export default function Home() {
  const [value, setValue] = useState("");
  const [parsingLink, setParsingLink] = useState<string>();
  const [code, setCode] = useState("");
  const [downloadLink, setDownloadLink] = useState<string>();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    sendGAEvent("event", "search_reel", { reel_url: value });
    setParsingLink(undefined);
    setDownloadLink(undefined);

    const refinedUrl = getRefinedUrl(value);

    if (refinedUrl === "NOT_VALID_URL") {
      alert("https://www.instagram.com으로 시작하는 올바른 URL을 넣어주세요");
      return;
    }

    if (refinedUrl === "NOT_REEL") {
      alert("릴스 URL이 아닙니다. 릴스 게시물에서 링크공유로 넣어주세요");
      return;
    }

    setParsingLink(refinedUrl + MAGIC_STRING);
  }

  function openUrl(url: string) {
    window.open(url, "_blank");
  }

  function onClickComplete() {
    try {
      const data = JSON.parse(code);
      const video_url = () => {
        if ("graphql" in data && "shortcode_media" in data.graphql) {
          return data.graphql.shortcode_media.video_url;
        }
        if ("items" in data) {
          return data.items[0].video_versions[0].url;
        }
        alert("제대로 복사되었는지 확인해주세요");
        return undefined;
      };
      sendGAEvent("event", "download_success", { success_reel_url: value });
      setDownloadLink(video_url);
    } catch (error) {
      alert("제대로 복사되었는지 확인해주세요");
    }
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <fieldset role="group">
          <input
            name="url"
            type="url"
            placeholder="릴스의 URL을 붙여넣어주세요"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <input type="submit" value="완료" />
        </fieldset>
      </form>
      {parsingLink && (
        <article>
          <nav className="justify-start gap-4">
            <button className="secondary" onClick={() => openUrl(parsingLink)}>
              접속하기
            </button>
            <button
              className="secondary"
              onClick={() =>
                copyToClipboard(
                  parsingLink,
                  "접속 링크가 복사되었습니다. 브라우저에 새 탭을 열어서 주소창에 붙여넣기 해주세요"
                )
              }>
              (모바일용) 복사하기
            </button>
          </nav>
          <textarea
            placeholder="위 버튼을 눌렀을 때 나오는 모든 글자를 복사해서 붙여넣어주세요"
            className="h-40 mt-4 text-xs"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <nav>
            <button
              className="contrast"
              onClick={onClickComplete}
              disabled={!code}>
              완료
            </button>
            {downloadLink && (
              <button onClick={() => openUrl(downloadLink)}>
                영상 다운로드하러 가기
              </button>
            )}
          </nav>
        </article>
      )}

      <article>
        <ul className="pl-4 mb-0 text-sm">
          <li>본 서비스는 PC환경에서 진행해주세요.</li>
          <li>릴스 게시물에서 [공유] - [링크 복사] 후 붙여넣기 해주세요</li>
          <li>
            <b>https://www.instagram.com/reel/</b> 로 시작되는 링크여야합니다
          </li>
          <li>
            브라우저에서 인스타그램에 로그인한 상태로 진행해야 정상적으로
            진행됩니다.
          </li>
        </ul>
      </article>
    </>
  );
}
