import { format } from "date-fns";
import { FormValues } from "@/interfaces/forms";
import { comillas } from "@/utils/funciones/funcionesGenerales";
import { useState, useEffect } from "react";

interface Campos {
  nuevoCampo: string;
  nuevoDato: string;
}

export function transformDELETE(form: FormValues): string {
  // const fechaHoy = new Date();

  // //Defino los campos adicionales
  // const camposAdicionales: Campos[] = [
  //   {
  //     nuevoCampo: "fechaCreacion",
  //     nuevoDato: "'" + format(fechaHoy.toISOString(), "dd/MM/yyyy") + "'",
  //   },
  //   {
  //     nuevoCampo: "fechaUltimaModificacion",
  //     nuevoDato: "'" + format(fechaHoy.toISOString(), "dd/MM/yyyy") + "'",
  //   },
  //   { nuevoCampo: "usuarioUltimaModificacion", nuevoDato: "1" },
  // ];
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
  // const query: string = `Delete into ${tabla} (${campos}) values (${valores})`;
  
  // return query;

     return "";
}

export default transformDELETE;
