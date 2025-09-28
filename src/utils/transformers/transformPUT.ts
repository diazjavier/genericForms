import { format } from "date-fns";
import { FormValues } from "@/interfaces/forms";
import { comillas } from "@/utils/funciones/funcionesGenerales";

interface Campos {
  nuevoCampo: string;
  nuevoDato: string;
}

export async function transformPUT(form: FormValues): Promise<string> {
  const fechaHoy = new Date();

  //Defino los campos adicionales
  const camposAdicionales: Campos[] = [
    {
      nuevoCampo: "fechaUltimaModificacion",
      nuevoDato: "'" + format(fechaHoy.toISOString(), "yyyy-MM-dd") + "'",
    },
    { nuevoCampo: "usuarioUltimaModificacion", nuevoDato: "1" },
  ];

  //No se pueden usar useStates en una función entonces tengo que armar los arrays así:
  const arrActualizaciones = form.fields
    .filter((field) => field.campoTabla && field.campoTabla !== "")
    .map(async (field) => {
      const val = await comillas(field.type, field.dataType, field.value?.[0]);
      return `"${field.campoTabla}" = ${val}`;
    });

  const adicionales = camposAdicionales.map(
    (c) => `"${c.nuevoCampo}" = ${c.nuevoDato}`
  );
  const arrActualizacionesResuletas = await Promise.all(arrActualizaciones);
  const allActualizaciones = [...arrActualizacionesResuletas, ...adicionales];
  const actualizaciones = allActualizaciones.join(", ");

  const tabla: string = form.table ?? "";
  const id: string = form.id?.toString() ?? "";
  const query: string = `Update "${tabla}" set ${actualizaciones} where id = ${id};`;
  //const query: string = `Update "Usuarios" set "usuario"='desdeAPI', "email"='desdeAPI@APImail.com' where id = 2`;

  return query;
}

export default transformPUT;
