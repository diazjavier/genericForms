import { Field } from "@/interfaces/forms";
import { FieldDefinition } from "./genericSchemas";

export function transformFieldsToSchemaDef(fields: Field[]): FieldDefinition[] {
  //  Convierte un Field[] del formulario a FieldDefinition[] genérico.

  return fields.map((f) => {
    let type: FieldDefinition["type"];

    // Mejor valido el tipo de dato que lleva la BD que es un parámetro más duro y que describe mejor el dato a guardar:
    // expresado en el campo dataType que es del tipo DataType = "integer" | "float" | "varchar" | "date" | "datetime" | "boolean" | "text";

    switch (f.dataType) {
      case "integer":
      case "float":
        type = "number";
        break;
      case "boolean":
        type = "boolean";
        break;
      case "date":
      case "datetime":
        type = "date";
        break;
      default: //Acá caen "varchar" y "text"
        type = "string";
        break;
    }

    return {
      name: f.name,
      type,
      required: f.required ?? false,
      subType: f.subType,
    };
  });
}
