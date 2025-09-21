import { NextRequest, NextResponse } from "next/server";
import { conn } from "@/utils/dbConnection";
import { messages } from "@/utils/messages";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/lib/brevo";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { username } = body;

    if (!username) {
      return new NextResponse(
        JSON.stringify({ message: messages.error.usernameRequired }),
        { status: 400 }
      );
    }

    const existingUser: any = await conn.query(
      'SELECT * FROM "Usuarios" WHERE usuario = $1',
      [username]
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

    const { password: createdPassword, ...userWithoutPassword } =
      existingUser.rows[0];

    const token = jwt.sign(
      { user: userWithoutPassword },
      process.env.NEXT_PUBLIC_JWT_SECRET || "default_secret",
      {
        expiresIn: process.env.NEXT_PUBLIC_JWT_EXPIRES_IN
          ? parseInt(process.env.NEXT_PUBLIC_JWT_EXPIRES_IN)
          : 86400,
      }
    );

    const forgetUrl = `http://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/change-password?token=${token}`;

    const mailTo = existingUser.rows[0].email;
    const name = existingUser.rows[0].usuario;
    const mailCc = ["diazjavier10@gmail.com"];
    const mailFrom = process.env.NEXT_PUBLIC_EMAIL_FROM as string;  
    const subject = "Restablecimiento de contraseña de su tienda online";
    const htmlContent = `<p>Hola ${name},</p>
        <p>Si desea reestablecer la contraseña de su tienda haga clic en el siguiente enlace: <a href=${forgetUrl}>Cambio de contraseña</a></p>
        <p>Si no solicitó este cambio, puede ignorar este correo electrónico.</p>
        <p>Saludos,</p>
        <p>Mi Tienda</p>`;   
    await sendEmail({ mailTo, name, mailCc, mailFrom, subject, htmlContent });

    const response = new NextResponse(
      JSON.stringify({
        user: userWithoutPassword,
        message: messages.success.mailSended,
      }),
      { status: 201 }
    );

    return response;
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: messages.error.serverError, error }),
      { status: 500 }
    );
  }
}
