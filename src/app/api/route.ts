import { NextRequest, NextResponse } from "next/server";

const MAGIC_STRING = "?__a=1&__d=dis" as const;

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.error();
  }

  const new_url = url + MAGIC_STRING;

  try {
    const res = await fetch(new_url);
    const data = await res.json();

    const video_url = data.graphql.shortcode_media.video_url;

    return NextResponse.json({ video: video_url });
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}
