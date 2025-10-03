"use server";

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
import { formUserRegiter } from "@/utils/forms/formUserRegister";
import {formUserDataTable} from "@/utils/forms/formUserDataTable";
import { formMediosDePagoRegiter } from "@/utils/forms/formMediosDePagoRegister";
import { formTiposDeMovimientosStockRegister } from "@/utils/forms/formTiposDeMovimientosStockRegister";

//Valida estructura de un dato tipo email
export async function isValidEmail(email: string): Promise<boolean> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return Promise.resolve(emailRegex.test(email));
}

//Hashea una password
export async function hashingPass(pass: string | undefined): Promise<string> {
  console.log("pass: ", pass);
  if (!pass) {
    return await bcrypt.hash("", 10);
  } else {
    return await bcrypt.hash(pass, 10);
  }
}

//le pone comillas a los datos que corresponde para armar un query válido para Postgres
export async function comillas(
  fieldType: TextType,
  dataType: DataType,
  dato: string | undefined
): Promise<string> {
  //   console.log("pass original: ", dato);
  //   console.log("pass[0][0]: ", dato?.[0][0]);

  //Si no hay dato devuelvo NULL
  if (!dato || (dato.length === 1 && dato[0] === "") || dato === undefined) {
    // console.log("dato NULL: ", "NULL");
    return "NULL";
  }

  //Si es numérico o booleano devuelvo el dato SIN comillas
  if (dataType in ["integer", "float", "boolean"]) {
    // console.log("dato: ", dato);
    return dato;
  }
  //Si el tipo de campo es password lo encripto antes de guardarlo y le pongo las comillas
  if (fieldType === "password") {
    // console.log("dato: ", dato);
    const hashedPass = await hashingPass(dato[0][0]);
    // console.log("dato: ", "'" + hashedPass + "'");
    return "'" + hashedPass + "'";
  }
  //Si es ["varchar" , "date" , "datetime" , "text"] devuelvo el dato con comillas
  //   console.log("dato sin comillas: ", dato);
  const datoConComillas: string = "'" + dato + "'";
  //   console.log("dato con comillas: ", datoConComillas);
  return datoConComillas;
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
      if (field.unique && field.campoTabla) {
        const validationQuery: string | undefined = (() => {
          if (form.action === "POST") {
            return `SELECT * FROM "${form.table}" WHERE "${
              field.campoTabla
            }" = ${"'" + field.value?.[0] + "'"};`;
          }

          if (form.action === "PUT") {
            return `SELECT * FROM "${form.table}" WHERE "${
              field.campoTabla
            }" = ${"'" + field.value?.[0] + "'"} and id != ${form.id};`;
          }
        })();

        if (validationQuery) {
          const existingData: any = await conn.query(validationQuery);

          if (existingData.rowCount > 0) {
            const resp: DataValidation = {
              validation: false,
              message: `${field.value?.[0]} ya existe en el campo ${field.label} `,
            };
            return resp;
          }
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
  return result.filter((r): r is DataValidation => r !== undefined);
}

//Para el alta de nuevos registros
export async function buscaForm(entity: string, action: string): Promise<FormValues | null> {
  //   let initialForm: FormValues | null = null;


  if(entity === "Usuarios" && ( action === "POST" || action === "PUT")){
      return formUserRegiter;
  }

  if(entity === "Usuarios" && action === "GET"){
      return formUserDataTable;
  }

  if(entity === "MediosDePago" && ( action === "POST" || action === "PUT" || action === "GET")){
      return formUserDataTable;
  }

  if(entity === "TiposDeMovimientosStock" && ( action === "POST" || action === "PUT" || action === "GET")){
      return formUserDataTable;
  }

  return null;

//   switch (entity) {
//     case "Usuarios":
//       return formUserRegiter;
//     case "MediosDePago":
//       return formMediosDePagoRegiter;
//     case "TiposDeMovimientosStock":
//       return formTiposDeMovimientosStockRegister;
//     default:
//       return null;
//   }

}

//Para la midificación de registros existentes
export async function buscaEditForm(
  entity: string,
  id: string
): Promise<FormValues | null> {
  //Traigo el modelo de form
  const formModel = await buscaForm(entity, "PUT");

  if (!formModel) {
    console.error(`No se encontró un formulario para la entidad: ${entity}`);
    return null;
  }

  if (!formModel.fields || formModel.fields.length === 0) {
    console.error(`El formulario de ${entity} no tiene campos definidos`);
    return null;
  }

  //Extraigo los nombres de los campos de la tabla que se incluyen en el modelo
  const arrCampos = [
    ...formModel.fields
      .filter((field) => field.campoTabla && field.campoTabla !== "")
      .map((field) => `"${field.campoTabla}"`),
  ];

  const query: string = `Select ${arrCampos} from "${entity}" where id = ${id}`;

  //Mando un POST en lugar de un GET porque con un GET no puedo mandar un body
  const request = new Request(
    `http://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/api/generic/get`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query }),
    }
  );

  const res = await fetch(request);
  const jsonRes = await res.json();

  //Resolver mejor el caso en el queno se encuentran datos
  if (!jsonRes || jsonRes.length === 0) {
    console.error(
      `No se encontraron datos para la entidad: ${entity} con id: ${id}`
    );
    return null;
  }
  //Armo una nueva estructura de tipo FormValues con los datos que trajo de la tabla
  //Hay que sacar el campo password para que no se vea en el formulario
  const newFormValues: FormValues = {
    ...formModel,
    action: "PUT",
    formName: `modifica${formModel.table}`,
    formTitle: `Edición de ${formModel.table}`,
    id: parseInt(id),
    fields: formModel.fields.map((field) =>
      field.campoTabla && arrCampos.includes(`"${field.campoTabla}"`)
        ? { ...field, value: [jsonRes[0][field.campoTabla]] }
        : field
    ),
  };

  return newFormValues;
}

//Para la midificación de registros existentes
export async function buscaEntityData(
  entity: string,
  formModel: FormValues
): Promise<FormValues | null> {
  //Traigo el modelo de form

  if (!formModel) {
    console.error(`No se encontró un formulario para la entidad: ${entity}`);
    return null;
  }

  if (!formModel.fields || formModel.fields.length === 0) {
    console.error(`El formulario de ${entity} no tiene campos definidos`);
    return null;
  }

  //Extraigo los nombres de los campos de la tabla que se incluyen en el modelo
  const arrCampos = [
    ...formModel.fields
      .filter((field) => field.campoTabla && field.campoTabla !== "")
      .map((field) => `"${field.campoTabla}"`),
  ];

  const query: string = `Select ${arrCampos} from "${entity}"`;

  //Mando un POST en lugar de un GET porque con un GET no puedo mandar un body
  const request = new Request(
    `http://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/api/generic/get`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query }),
    }
  );

  const res = await fetch(request);
  const jsonRes = await res.json();
  
  //Resolver mejor el caso en el queno se encuentran datos
  if (!jsonRes || jsonRes.length === 0) {
    console.error(
      `No se encontraron datos para la entidad: ${entity}`
    );
    return null;
  }
  //Armo una nueva estructura de tipo FormValues con los datos que trajo de la tabla
  //Hay que sacar el campo password para que no se vea en el formulario
  const newFormValues: FormValues = {
    ...formModel,
    action: "GET",
    formName: `datosDe${formModel.table}`,
    formTitle: `${formModel.formTitle}`,
    fields: formModel.fields.map((field) =>
      field.campoTabla && arrCampos.includes(`"${field.campoTabla}"`)
        ? { ...field, value: [jsonRes[0][field.campoTabla]] }
        : field
    ),
  };

  console.log(newFormValues.fields)

  return newFormValues;
}

