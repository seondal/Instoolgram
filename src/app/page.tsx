"use client";

import copyToClipboard from "@/utils/copyToClipboard";
import { sendGAEvent } from "@next/third-parties/google";
import { FormEvent, useState } from "react";

const MAGIC_STRING = (id: string) =>
  `https://www.instagram.com/graphql/query/?doc_id=8845758582119845&variables={%22shortcode%22:%22${id}%22}` as const;

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

  const refined_url = splitted[4];

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

    setParsingLink(MAGIC_STRING(refinedUrl));
  }

  function openUrl(url: string) {
    window.open(url, "_blank");
  }

  function onClickComplete() {
    try {
      const codeJson = JSON.parse(code);
      const video_url = () => {
        if (
          "data" in codeJson &&
          "xdt_shortcode_media" in codeJson.data &&
          "video_url" in codeJson.data.xdt_shortcode_media
        ) {
          const videoUrl = codeJson.data.xdt_shortcode_media.video_url;
          return videoUrl;
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
      {/* <article className="text-center">
        <h5>
          인스타그램 정책 변경으로 인해 현재 이용이 불가능합니다.
          <br />
          조만간 업데이트하고 인스타에 소식 올리겠습니다
          <br />
        </h5>
        <a href={DEVELOPER}>인스타그램 : @dev_seondal</a>
      </article> 
      <hr /> */}
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
              }
            >
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
              disabled={!code}
            >
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
            브라우저에서 <b>인스타그램에 로그인 된</b> 상태로 진행해야
            정상적으로 진행됩니다.
          </li>
        </ul>
      </article>
    </>
  );
}
