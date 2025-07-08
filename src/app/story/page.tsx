"use client";

import copyToClipboard from "@/utils/copyToClipboard";
import { sendGAEvent } from "@next/third-parties/google";
import Image from "next/image";
import { FormEvent, useState } from "react";

const MAGIC_STRING = (id: string) =>
  `https://www.instagram.com/graphql/query/?query_hash=45246d3fe16ccc6577e0bd297a5db1ab&variables={%22highlight_reel_ids%22:[%22${id}%22],%22reel_ids%22:[],%22location_ids%22:[],%22precomposed_overlay%22:false}` as const;

function getRefinedUrl(url: string) {
  const splitted = url.split("/");

  if (
    splitted[0] !== "https:" ||
    splitted[1] !== "" ||
    splitted[2] !== "www.instagram.com"
  ) {
    return "NOT_VALID_URL";
  }

  if (
    splitted[3] !== "stories" ||
    splitted[4] !== "highlights" ||
    typeof splitted[5] !== "string"
  ) {
    return "NOT_STORY";
  }

  const refined_url = splitted[5];

  return refined_url;
}

interface ResourceI {
  preview: string;
  src: string;
}

export default function Home() {
  const [value, setValue] = useState("");
  const [parsingLink, setParsingLink] = useState<string>();
  const [code, setCode] = useState("");
  const [downloadLink, setDownloadLink] = useState<ResourceI[]>();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    sendGAEvent("event", "search_highlight", { highlight_url: value });
    setParsingLink(undefined);
    setDownloadLink(undefined);

    const refinedUrl = getRefinedUrl(value);

    if (refinedUrl === "NOT_VALID_URL") {
      alert("https://www.instagram.com으로 시작하는 올바른 URL을 넣어주세요");
      return;
    }

    if (refinedUrl === "NOT_STORY") {
      alert(
        "하이라이트의 URL이 아닙니다. 하이라이트에서 보내기 -> 링크복사 후 넣어주세요"
      );
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
      console.log(codeJson.data.reels_media[0].items);
      const video_url = () => {
        if (
          "data" in codeJson &&
          "reels_media" in codeJson.data &&
          "items" in codeJson.data.reels_media[0]
        ) {
          const items = codeJson.data.reels_media[0].items;

          let urls: ResourceI[] = [];
          for (const item of items) {
            const typename = item.__typename;
            if (typename === "GraphStoryImage") {
              urls.push({
                preview: item.display_resources[0].src,
                src: item.display_url,
              });
            } else if (typename === "GraphStoryVideo") {
              urls.push({
                preview: item.display_resources[0].src,
                src: item.video_resources[0].src,
              });
            }
          }
          console.log("🚀 ~ constvideo_url= ~ urls:", urls);
          return urls;
        }
        alert("제대로 복사되었는지 확인해주세요");
        return undefined;
      };
      sendGAEvent("event", "download_success_story", {
        success_highlight_url: value,
      });
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
            placeholder="스토리가 담긴 하이라이트의 URL을 입력해주세요"
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
          </nav>
          <textarea
            placeholder="위 버튼을 눌렀을 때 나오는 모든 글자를 복사해서 붙여넣어주세요"
            className="h-40 mt-4 text-xs"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            className="contrast"
            onClick={onClickComplete}
            disabled={!code}>
            완료
          </button>
          {downloadLink && (
            <footer>
              <h5>다운로드 하러 가기</h5>
              <div className="flex flex-wrap gap-4">
                {downloadLink.map((resource, idx) => (
                  <button
                    onClick={() => openUrl(resource.src)}
                    key={idx}
                    className="contrast p-1 hover:opacity-30">
                    <Image
                      src={resource.preview}
                      alt={idx.toString()}
                      width={40}
                      height={40}
                    />
                  </button>
                ))}
              </div>
            </footer>
          )}
        </article>
      )}

      <article>
        <ul className="pl-4 mb-0 text-sm">
          <li>본 서비스는 PC환경에서 진행해주세요.</li>
          <li>
            스토리가 있는 하이라이트에서 [보내기] - [링크복사] 후 붙여넣기
            해주세요{" "}
          </li>
          <li>
            <b>https://www.instagram.com/stories/highlights/</b> 로 시작되는
            링크여야합니다
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
