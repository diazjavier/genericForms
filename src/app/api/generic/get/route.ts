import { NextRequest, NextResponse } from "next/server";
import { conn } from "@/utils/dbConnection";
import { messages } from "@/utils/messages";
import { FormValues } from "@/interfaces/forms";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;
    const resp = await conn.query(query);

    return new Response(JSON.stringify(resp.rows));

  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: messages.error.serverError, error }),
      { status: 500 }
    );
  }
}
