import { NextRequest, NextResponse } from "next/server";
import { conn } from "@/utils/dbConnection";
import { messages } from "@/utils/messages";
//import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const headersList = headers();
    const token = (await headersList).get("token")?.replace("Bearer ", "");

    if (!token) {
      return new NextResponse(
        JSON.stringify({ message: messages.error.tokenRequired }),
        { status: 401 }
      );
    }

    try {
      const decoded: any = jwt.verify(
        token,
        process.env.NEXT_PUBLIC_JWT_SECRET
          ? process.env.NEXT_PUBLIC_JWT_SECRET
          : "default_secret"
      );
      
      const { user } = decoded;
      const userId = user.id;

      const existingUser: any = await conn.query(
        'SELECT * FROM "Usuarios" WHERE id = $1',
        [userId]
      );

      if (existingUser.rowCount === 0) {
        return new Response(
          JSON.stringify({ message: messages.error.userNotFound }),
          { status: 400 }
        );
      }

      if (existingUser.rows[0].fechaFin) {
        return new Response(
          JSON.stringify({ message: messages.error.userDeactivated }),
          { status: 400 }
        );
      }

      return new NextResponse(
        JSON.stringify({ message: messages.success.authorized }),
        { status: 201 }
      );
      
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ message: messages.error.tokenRequired }),
        { status: 401 }
      );
    }
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: messages.error.serverError, error }),
      { status: 500 }
    );
  }
}
