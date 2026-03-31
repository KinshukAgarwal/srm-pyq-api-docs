import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://srm-pyq-api.onrender.com";

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path") || "";
  if (!path.startsWith("/")) {
    return NextResponse.json({ error: "Invalid path parameter." }, { status: 400 });
  }

  const target = new URL(path, BASE_URL);
  for (const [key, value] of request.nextUrl.searchParams.entries()) {
    if (key === "path") {
      continue;
    }
    target.searchParams.set(key, value);
  }

  const upstream = await fetch(target.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  const body = await upstream.text();
  const contentType = upstream.headers.get("content-type") || "application/json";

  return new NextResponse(body, {
    status: upstream.status,
    headers: {
      "content-type": contentType,
    },
  });
}
