import { FormValues } from "@/interfaces/forms";

export const formTiposDeMovimientosStockRegister: FormValues = {
  formName: "formTiposDeMovimientosStockRegister",
  formTitle: "Alta de Tipos de Movimiento del Stock",
  action: "POST",
  table: "TiposDeMovimientosStock",
  fields: [
    {
      fieldType: "input",
      label: "Tipo de Movimiento",
      name: "tipoMovimiento",
      type: "text",
      subType: "text",
      placeholder: "Escriba un tipo de movimiento...",
      autofocus: true,
      required: true,
      value: [""],
      dataType: "varchar",
      campoTabla: "descripcion",
      unique: true,
    },
    {
      fieldType: "datepicker",
      label: "Estado",
      name: "fbaja",
      type: "text",
      subType: "date",
      placeholder: "Fcha de baja...",
      autofocus: false,
      required: false,
      dataType: "date",
      campoTabla: "fechaFin",
    },
  ],
  buttons: [
    {
      label: "Cancelar",
      type: "reset",
      color: "gray",
    },
    {
      label: "Guardar",
      type: "submit",
      color: "grass",
    },
  ],
};
