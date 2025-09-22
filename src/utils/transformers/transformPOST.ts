import { format } from "date-fns";
import { FormValues } from "@/interfaces/forms";
import { comillas } from "@/utils/funciones/funcionesGenerales";

interface Campos {
  nuevoCampo: string;
  nuevoDato: string;
}

export async function transformPOST(form: FormValues): Promise<string> {
  const fechaHoy = new Date();

  //Defino los campos adicionales
  const camposAdicionales: Campos[] = [
    {
      nuevoCampo: `"fechaCreacion"`,
      nuevoDato: "'" + format(fechaHoy.toISOString(), "yyyy-MM-dd") + "'",
    },
    {
      nuevoCampo: `"fechaUltimaModificacion"`,
      nuevoDato: "'" + format(fechaHoy.toISOString(), "yyyy-MM-dd") + "'",
    },
    { nuevoCampo: `"usuarioUltimaModificacion"`, nuevoDato: "1" },
  ];

  //No se pueden usar useStates en una función entonces tengo que armar los arrays así:
  // Campos
  // Para el query en Postgres necesito ponerle comillas dobles a los nombres de los campos y al nombre de la tabla
  const arrCampos = [
    ...form.fields
      .filter((field) => field.campoTabla && field.campoTabla !== "")
      .map((field) => `"${field.campoTabla}"`),
    ...camposAdicionales.map((c) => c.nuevoCampo),
  ];

  // Valores
  const arrValores = [
    ...(await Promise.all(form.fields
      .filter((field) => field.campoTabla && field.campoTabla !== "")
      .map(async (field) => await comillas(field.type, field.dataType, field.value?.[0]))
  )),
    ...camposAdicionales.map((c) => c.nuevoDato),
  ];

  //Armo un solo string concatenando todos los elementos del array con una coma (", ")
  const campos = arrCampos.join(", ");
  const valores = arrValores.join(", ");
  
  const tabla: string = form.table ?? "";
  const query: string = `Insert into "${tabla}" (${campos}) values (${valores})`;

  return query;
}

export default transformPOST;
