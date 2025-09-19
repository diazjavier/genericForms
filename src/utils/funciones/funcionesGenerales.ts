import bcrypt from "bcryptjs";
 import { TextType, DataType } from "@/interfaces/forms";
// import transformPOST from "@/utils/transformers/transformPOST";
// import transformPUT from "@/utils/transformers/transformPUT";
// import transformGET from "@/utils/transformers/transformGET";
// import transformDELETE from "@/utils/transformers/transformDELETE";

export async function hashingPass(pass: string | undefined): Promise<string> {
  if (!pass) {
    return bcrypt.hash("", 10);
  } else {
    return bcrypt.hash(pass, 10);
  }
}

export async function comillas(
  fieldType: TextType,
  dataType: DataType,
  dato: string | undefined
): Promise<string> {

// console.log(fieldType, dataType, dato?.[0])

  if (!dato || (dato.length === 1 && dato[0] === "") || dato === undefined) {
    // console.log("Entro al 1")
    return "NULL";
  }
  if (dataType in ["integer", "float", "boolean"]) {
    // console.log("Entro al 2")
    return dato[0];
  }
  //Si el tipo de campo es password lo encripto antes de guardarlo y le pongo las comillas
  if (fieldType === "password") {
    // console.log("Entro al 3", ["' LaPassword... '"])
    const hashedPass = await hashingPass(dato[0]);
    return "'" + hashedPass + "'";
    //  return " LaPassword... ";
  }
  //Si es ["varchar" , "date" , "datetime" , "text"] devuelvo el dato con comillas
//   console.log("Entro al 4", dato[0])
  return "'" + dato[0] + "'";
//   return dato[0];
}

// export function generaQuery(form: FormValues): string {
//   switch (form.action) {
//     case "POST":
//       return transformPOST(form);
//     case "PUT":
//       return transformPUT(form);
//     case "GET":
//       return transformGET(form);
//     case "DELETE":
//       return transformDELETE(form);
//     default:
//       return "";
//   }
// }
