import { format } from "date-fns";
import { FormValues } from "@/interfaces/forms";
import { comillas } from "@/utils/funciones/funcionesGenerales";
import { useState, useEffect } from "react";

interface Campos {
  nuevoCampo: string;
  nuevoDato: string;
}

export function transformPUT(form: FormValues): string {
  const fechaHoy = new Date();
  const [campos, setCampos] = useState<(string | undefined)[]>([]);
  const [valores, setValores] = useState<(string | undefined)[]>([]);

  //Defino los campos adicionales
  const camposAdicionales: Campos[] = [
    {
      nuevoCampo: "fechaCreacion",
      nuevoDato: "'" + format(fechaHoy.toISOString(), "dd/MM/yyyy") + "'",
    },
    {
      nuevoCampo: "fechaUltimaModificacion",
      nuevoDato: "'" + format(fechaHoy.toISOString(), "dd/MM/yyyy") + "'",
    },
    { nuevoCampo: "usuarioUltimaModificacion", nuevoDato: "1" },
  ];

  function cargaCampos(camposAdicionales: Campos[]) {
    //Primero agrego los campos definidos
    const losCampos = form.fields.map((field) => {
      //Si no está definido el nombre del campo en form.fields no lo agrego el campo
      if (field.campoTabla && field.campoTabla !== "") {
        return field.campoTabla;
      }
    });
    setCampos(losCampos);

    //Ahora agrego los campos ocultos
    camposAdicionales.map((cadd) => {
      setCampos([...campos, cadd.nuevoDato]);
    });
  }

  function cargaValores(camposAdicionales: Campos[]) {
    //Primero agrego los campos definidos
    const losValores = form.fields.map((field) => {
      //Si no está definido el nombre del campo en form.fields no agrego el valor
      if (field.campoTabla && field.campoTabla !== "") {
        return comillas(field.dataType, field.value);
      }
    });
    setValores(losValores);

    //Ahora agrego los campos ocultos
    camposAdicionales.map((cadd) => {
      setValores([...valores, cadd.nuevoCampo]);
    });
  }

  //Iicio los campos con este userEffect
  useEffect(() => {
    cargaCampos(camposAdicionales);
    cargaValores(camposAdicionales);
  }, []);

  const tabla: string = form.table ?? "";
  const query: string = `Update into ${tabla} (${campos}) values (${valores})`;
  
  return query;

}

export default transformPUT;
