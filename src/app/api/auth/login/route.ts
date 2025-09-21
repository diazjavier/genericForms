import { NextRequest, NextResponse } from "next/server";
import { conn } from "@/utils/dbConnection";
import { messages } from "@/utils/messages";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        
        const { username, password} = body;

        if (!username) {
            return new NextResponse(JSON.stringify({ message: messages.error.usernameRequired }), { status: 400 })  
        } if (!password) {
            return new NextResponse(JSON.stringify({ message: messages.error.passwordRequired }), { status: 400 })
        }
        const existingUser: any = await conn.query('SELECT * FROM "Usuarios" WHERE usuario = $1', [username]);

        if (existingUser.rowCount === 0) {
            return new Response(JSON.stringify({ message: messages.error.userNotFound }), { status: 400 })
        }

        const passwordMatch: boolean = await bcrypt.compare(password, existingUser.rows[0].password);

        if (!passwordMatch) {
            return new Response(JSON.stringify({ message: messages.error.invalidPassword }), { status: 400 })
        }

        const { password: userPassword, ...userWithoutPassword } = existingUser.rows[0];

        const token = jwt.sign(
            { user: userWithoutPassword },
            process.env.NEXT_PUBLIC_JWT_SECRET || 'default_secret',
            { expiresIn: process.env.NEXT_PUBLIC_JWT_EXPIRES_IN ? parseInt(process.env.NEXT_PUBLIC_JWT_EXPIRES_IN) : 86400 }
        );

        const response = new NextResponse(JSON.stringify({ user: userWithoutPassword, message: messages.success.loggedIn }), { status: 201 })
    
        response.cookies.set('tokenauth_cookie', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: process.env.NEXT_PUBLIC_JWT_EXPIRES_IN ? parseInt(process.env.NEXT_PUBLIC_JWT_EXPIRES_IN) : 86400,
            path: '/'
        });      
        
        return response;

    } catch (error) {
        return new NextResponse(JSON.stringify({ message: messages.error.serverError, error }), { status: 500 })
    }   

}
