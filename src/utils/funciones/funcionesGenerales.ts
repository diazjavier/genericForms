"use server"

import bcrypt from "bcryptjs";
import {
  TextType,
  DataType,
  FormValues,
  Field,
  DataValidation,
} from "@/interfaces/forms";
import { messages } from "@/utils/messages";
import { conn } from "@/utils/dbConnection";
//import { isValidEmail } from "@/utils/funciones/funcionesGenerales";

//Valida estructura de un dato tipo email
export async function isValidEmail(email: string): Promise<boolean> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return Promise.resolve(emailRegex.test(email));
}

//Hashea una password
export async function hashingPass(pass: string | undefined): Promise<string> {
  if (!pass) {
    return bcrypt.hash("", 10);
  } else {
    return bcrypt.hash(pass, 10);
  }
}

//le pone comillas a los datos que corresponde para armar un query válido para Postgres
export async function comillas(
  fieldType: TextType,
  dataType: DataType,
  dato: string | undefined
): Promise<string> {
  //Si no hay dato devuelvo NULL
  if (!dato || (dato.length === 1 && dato[0] === "") || dato === undefined) {
    return "NULL";
  }

  //Si es numérico o booleano devuelvo el dato SIN comillas
  if (dataType in ["integer", "float", "boolean"]) {
    return dato[0];
  }
  //Si el tipo de campo es password lo encripto antes de guardarlo y le pongo las comillas
  if (fieldType === "password") {
    const hashedPass = await hashingPass(dato[0]);
    return "'" + hashedPass + "'";
  }
  //Si es ["varchar" , "date" , "datetime" , "text"] devuelvo el dato con comillas
  return "'" + dato[0] + "'";
}

//Valida los datos para un query genérico
export async function validaDatos(form: FormValues): Promise<DataValidation[]> {
  //Valido los campos
  const validations: Promise<DataValidation | undefined>[] = form.fields.map(
    async (field: Field) => {
      // 1- Valido los campos obligatorios
      if (
        field.required &&
        (!field.value ||
          field.value?.length === 0 ||
          field.value.some((str) => str === ""))
      ) {
        const resp: DataValidation = {
          validation: false,
          message: `El campo ${field.campoTabla} es obligatorio`,
        };
        return resp;
      }

      // 2- Valido el formato cuando es un email
      if (
        field.subType === "email" &&
        field.value &&
        field.value[0] !== "" &&
        !(await isValidEmail(field.value?.[0]))
      ) {
        const resp: DataValidation = {
          validation: false,
          message: messages.error.invalidEmail,
        };
        return resp;
      }

      // 3- Valido si existe el dato en la tabla cuando es un campo unique (como por Ej: el nombre de usuario)
      if (field.unique) {
        const validationQuery: string = `SELECT * FROM "${form.table}" WHERE "${
          field.campoTabla
        }" = ${"'" + field.value?.[0] + "'"};`;
        const existingData: any = await conn.query(validationQuery);

        if (existingData.rowCount > 0) {
          const resp: DataValidation = {
            validation: false,
            message: `${field.value?.[0]} ya existe en el campo ${field.label} `,
          };
          return resp;
        }
      }

      // Si no hubo errores → validación OK
      return {
        validation: true,
        message: "Validación exitosa",
      };

    }
  );

  const result = await Promise.all(validations);
  //console.log("Las validaciones son: ", result);
  //   return validations ?? [{ validation: true, message: "Validación exitosa" }];
  return result.filter((r): r is DataValidation => r !== undefined);
}
