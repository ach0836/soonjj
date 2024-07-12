import { NextResponse } from "next/server";
import { getXataClient } from "@/xata";

const xata = getXataClient();

export async function GET(req) {
  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const data = await xata.db.requests.getMany(params);

  return NextResponse.json({ requests: data }); // requests 키로 감싸서 반환
}

export async function POST(req) {
  const body = await req.json();
  const data = await xata.db.requests.create(body);

  return NextResponse.json(data);
}

export async function PUT(req) {
  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const body = await req.json();
  const data = await xata.db.requests.createOrReplace(params.id, body);

  return NextResponse.json(data);
}

export async function PATCH(req) {
  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const body = await req.json();
  const data = await xata.db.requests.update(params.id, body);

  return NextResponse.json(data);
}

export async function DELETE(req) {
  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const data = await xata.db.requests.delete(params.id);

  return NextResponse.json(data);
}
