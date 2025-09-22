import { NextRequest, NextResponse } from "next/server";
import { conn } from "@/utils/dbConnection";
import { messages } from "@/utils/messages";
 //import { isValidEmail } from "@/utils/isValidEmail";
 import { Field, FormValues } from "@/interfaces/forms";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    //console.log("El body es: ", JSON.stringify(body, null, 2));

     const { query, form } = body;


    // //Valido los campos
    // const validations = form.fields.map(async (field: Field) => {
    //   // 1- Valido los campos obligatorios
    //   if (
    //     field.required &&
    //     (!field.value ||
    //       field.value?.length === 0 ||
    //       field.value.some((str) => str === ""))
    //   ) {
    //     return new NextResponse(
    //       JSON.stringify({
    //         message: `El campo ${field.campoTabla} es obligatorio`,
    //       }),
    //       { status: 400 }
    //     );
    //   }

    //   // 2- Valido el formato cuando es un email
    //   if (
    //     field.subType === "email" &&
    //     field.value &&
    //     field.value[0] !== "" &&
    //     !isValidEmail(field.value?.[0])
    //   ) {
    //     console.log("Etró a validar el mail");
    //     return new NextResponse(
    //         JSON.stringify({ message: messages.error.invalidEmail }),
    //         { status: 400 }
    //     );
    // }
    
    // // 3- Valido si existe el dato en la tabla cuando es un campo unique (como por Ej: el nombre de usuario)
    // if (field.unique) {
        
    //     const validationQuery: string = `SELECT * FROM "${form.table}" WHERE "${field.campoTabla}" = ${"'"+field.value?.[0]+"'"};`;
    //     const existingData: any = await conn.query(validationQuery);
        
    //     if (existingData.rowCount > 0) {
    //         console.log("Entró y Las filas devueltas son: ", existingData.rowCount);
    //       return new NextResponse(
    //         JSON.stringify({
    //           message: `${field.value?.[0]} ya existe en el campo ${field.label} `,
    //         }),
    //         { status: 400 }
    //       );
    //     }
    //   }
    // });

    // console.log("Las validaciones son: ", validations);

    // Si pasa todas las validaciones guardo y genero el objeto a devolver
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

    // const result = await conn.query(query);
    //console.log("El result del Query: ", result);

    const response = new NextResponse(
      JSON.stringify({
        newRow: newRegister,
        message: messages.success.userCreated,
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
