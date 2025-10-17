import { NextRequest, NextResponse } from "next/server";
import { conn } from "@/utils/dbConnection";
import { messages } from "@/utils/messages";
import { FormValues } from "@/interfaces/forms";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, form } = body;

    console.log("query en POST genérico:", query);

    // Guardo y genero el objeto a devolver
    await conn.query(query);

    // Esta fución genera un objeto del tipo FormValues pero sin el dato password
    function removePassword(form: FormValues): FormValues {
      return {
        ...form,
        fields: form.fields.filter((field) => field.subType !== "password"),
      };
    }

    // Saco las passwords del objeto form para pasárselo a la response
    const newRegister: FormValues = removePassword(form);

    const payload = {
      newRow: newRegister,
      message: messages.success.userCreated,
    };

    const response = new NextResponse(JSON.stringify(payload), { status: 201 });

    return response;
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: messages.error.serverError, error }),
      { status: 500 }
    );
  }
}
