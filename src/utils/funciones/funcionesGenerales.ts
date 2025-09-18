import { FormValues } from "@/interfaces/forms";
import transformPOST from "@/utils/transformers/transformPOST";
import transformPUT from "@/utils/transformers/transformPUT";
import transformGET from "@/utils/transformers/transformGET";
import transformDELETE from "@/utils/transformers/transformDELETE";

export function comillas(dataType: string, dato: string[] | undefined): string {
  if (!dato || (dato.length === 1 && dato[0] === "") || dato === undefined) {
    return "NULL";
  }
  if (dataType in ["integer", "float", "boolean"]) {
    return dato[0];
  }
  //Si es ["varchar" , "date" , "datetime" , "text"] devuelvo el dato con comillas
  return "'" + dato[0] + "'";
}

export function generaQuery(form: FormValues): string {
  switch (form.action) {
    case "POST":
      return transformPOST(form);
    case "PUT":
      return transformPUT(form);
    case "GET":
      return transformGET(form);
    case "DELETE":
      return transformDELETE(form);
    default:
      return "";
  }
}
