import { NextRequest, NextResponse } from "next/server";
import { conn } from "@/utils/dbConnection";
import { messages } from "@/utils/messages";
//import { isValidEmail } from "@/utils/isValidEmail";
//import { Usuario } from "@/interfaces/usuarios";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { newPassword, confirmPassword } = body;

    if (!newPassword) {
      return new NextResponse(
        JSON.stringify({ message: messages.error.passwordRequired }),
        { status: 400 }
      );
    }
    if (!confirmPassword) {
      return new NextResponse(
        JSON.stringify({ message: messages.error.confirmPasswordRequired }),
        { status: 400 }
      );
    }
    if (newPassword !== confirmPassword) {
      return new NextResponse(
        JSON.stringify({ message: messages.error.passwordMatch }),
        { status: 400 }
      );
    }

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

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await conn.query(
        'UPDATE "Usuarios" set password = $1 WHERE id = $2', [hashedPassword, userId]
      );

      return new NextResponse(
        JSON.stringify({ message: messages.success.passwordChanged }),
        { status: 201 }
      );
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ message: messages.error.tokenRequired }),
        { status: 401 }
      );
    }
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({ message: messages.error.serverError, error }),
      { status: 500 }
    );
  }
}
