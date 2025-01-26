"use client";

import { SITE } from "@/constants/env";
import { FormEvent, useState } from "react";

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
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLink(undefined);

    const refinedUrl = getRefinedUrl(value);

    if (refinedUrl === "NOT_VALID_URL") {
      alert("https://www.instagram.com으로 시작하는 올바른 URL을 넣어주세요");
      return;
    }

    if (refinedUrl === "NOT_REEL") {
      alert("릴스 URL이 아닙니다. 릴스 게시물에서 링크공유로 넣어주세요");
      return;
    }

    setLoading(true);
    fetch(`${SITE}/api?url=${refinedUrl}`)
      .then((res) => res.json())
      .then((data) => {
        setLink(data.video);
        setLoading(false);
      })
      .catch((error) => {
        alert(
          "에러가 발생했어요. 아래 조건을 확인해주세요. 계속 문제가 발생할 경우 개발자에게 문의해주세요"
        );
        setLoading(false);
      });
  }

  function onClickDownload() {
    window.open(link);
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
          <input type="submit" value="완료" disabled={loading} />
        </fieldset>
      </form>
      {link && (
        <article>
          {!loading && (
            <button className="secondary" onClick={onClickDownload}>
              다운받으러 가기
            </button>
          )}
        </article>
      )}
      <article>
        <ul>
          <li>원하는 릴스에서 [공유] - [링크 복사] 후 붙여넣기 해주세요</li>
          <li>
            <b>https://www.instagram.com/reel/</b> 로 시작되는 링크여야합니다
          </li>
          <li>전체 공개 게시물만 가능합니다</li>
          <li>
            <b>단 한번이라도</b> 계정을{" "}
            <strong className="text-pico-underline">비공개</strong> 처리했던
            개인 계정의 릴스는 다운로드가 불가능합니다
          </li>
        </ul>
      </article>
    </>
  );
}
