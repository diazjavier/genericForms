import { format } from "date-fns";
import { FormValues } from "@/interfaces/forms";
import { comillas } from "@/utils/funciones/funcionesGenerales";
import { useState, useEffect } from "react";

interface Campos {
  nuevoCampo: string;
  nuevoDato: string;
}

export function transformRESTORE(table: string, id: string): string {
  const fechaHoy = new Date();

  //Defino los campos adicionales
  const camposAdicionales: Campos[] = [
    {
      nuevoCampo: "fechaFin",
      nuevoDato: "NULL",
    },
    {
      nuevoCampo: "fechaUltimaModificacion",
      nuevoDato: "'" + format(fechaHoy, "yyyy-MM-dd'T'00:00:00XXX") + "'",
    },
    { nuevoCampo: "usuarioUltimaModificacion", nuevoDato: "1" },
  ];
  // //No se pueden usar useStates en una función entonces tengo que armar los arrays así:
  // // Campos
  // const campos = [
  //   ...form.fields
  //     .filter((field) => field.campoTabla && field.campoTabla !== "")
  //     .map((field) => field.campoTabla as string),
  //   ...camposAdicionales.map((c) => c.nuevoCampo),
  // ];

  // // Valores
  // const valores = [
  //   ...form.fields
  //     .filter((field) => field.campoTabla && field.campoTabla !== "")
  //     .map((field) => comillas(field.type, field.dataType, field.value)),
  //   ...camposAdicionales.map((c) => c.nuevoDato),
  // ];
  // const tabla: string = form.table ?? "";

  const adicionales = camposAdicionales.map(
    (c) => `"${c.nuevoCampo}" = ${c.nuevoDato}`
  );

  // const query: string = `Update "${table}" set fechaFin = '${format(
  //   fechaHoy,
  //   "yyyy-MM-dd"
  // )}', ${adicionales}  where id = ${id};`;

  const query: string = `Update "${table}" set ${adicionales}  where id = ${id};`;

  return query;

  //return "";
}

export default transformRESTORE;
