import { NextRequest, NextResponse } from "next/server";
import { conn } from "@/utils/dbConnection";
import { messages } from "@/utils/messages";
import { isValidEmail } from "@/utils/isValidEmail";
import { Usuario } from "@/interfaces/usuarios";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        
        const { username, email, password, confirmPassword} = body;

        if (!username) {
            return new NextResponse(JSON.stringify({ message: messages.error.usernameRequired }), { status: 400 })  
        } if (!email) {
            return new NextResponse(JSON.stringify({ message: messages.error.emailRequired }), { status: 400 })
        } if (!password) {
            return new NextResponse(JSON.stringify({ message: messages.error.passwordRequired }), { status: 400 })
        } if (!confirmPassword) {
            return new NextResponse(JSON.stringify({ message: messages.error.confirmPasswordRequired }), { status: 400 })
        } if (password !== confirmPassword) {
            return new NextResponse(JSON.stringify({ message: messages.error.passwordMatch }), { status: 400 })
        } if (!isValidEmail(email)) {
            return new NextResponse(JSON.stringify({ message: messages.error.invalidEmail }), { status: 400 })
        }
        
        const existingUser: any = await conn.query('SELECT * FROM "Usuarios" WHERE usuario = $1', [username]);

        if (existingUser.rowCount > 0) {
            return new Response(JSON.stringify({ message: messages.error.userExists }), { status: 400 })
        }
        
        const hashedPassword = await bcrypt.hash(password, 10); 
        
        await conn.query('INSERT INTO "Usuarios" (usuario, email, password) VALUES ($1, $2, $3)', [username, email, hashedPassword]);   

        const newUser: Usuario = {
            username,
            email,
            password: hashedPassword
        };

        const { password: createdPassword, ...userWithoutPassword } = newUser;

        const token = jwt.sign(
            { user: userWithoutPassword },
            process.env.NEXT_PUBLIC_JWT_SECRET || 'default_secret',
            { expiresIn: process.env.NEXT_PUBLIC_JWT_EXPIRES_IN ? parseInt(process.env.NEXT_PUBLIC_JWT_EXPIRES_IN) : 86400 }
        );

        const response = new NextResponse(JSON.stringify({ user: userWithoutPassword, message: messages.success.userCreated }), { status: 201 })
    
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
