import { format } from "date-fns";
import { FormValues } from "@/interfaces/forms";
import { comillas } from "@/utils/funciones/funcionesGenerales";

export function transformGET(form: FormValues): string {
  //No se pueden usar useStates en una función entonces tengo que armar los arrays así:
  // Campos
  const campos = [
    ...form.fields
      .filter((field) => field.campoTabla && field.campoTabla !== "")
      .map((field) => field.campoTabla as string),
  ];

  const tabla: string = form.table ?? "";
  const id: string = form.id?.toString() ?? "";
  const query: string = `Select ${campos} from ${tabla} where id = ${id}`;

  return query;
}

export default transformGET;
