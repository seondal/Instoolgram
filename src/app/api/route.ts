import { NextRequest, NextResponse } from "next/server";

const MAGIC_STRING = "?__a=1&__d=dis" as const;

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "No URL in Query" }, { status: 400 });
  }

  const new_url = url + MAGIC_STRING;
  console.log("🚀 ~ GET ~ new_url:", new_url);

  try {
    const res = await fetch(new_url);
    console.log("🚀 ~ GET ~ res:", res);
    const data = await res.json();

    const video_url = data.graphql.shortcode_media.video_url;

    return NextResponse.json({ video: video_url });
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}
