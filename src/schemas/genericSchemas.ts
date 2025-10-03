import { z, ZodTypeAny } from "zod";
import { subTypeValidations } from "./validations";

export interface FieldDefinition {
  name: string;
  type: "string" | "number" | "boolean" | "date";
  required?: boolean;
  subType?: string;
}

// 🔹 Tipos base compatibles
const zodTypeMap: Record<FieldDefinition["type"], ZodTypeAny> = {
  string: z.string(),
  number: z.number(),
  boolean: z.boolean(),
  date: z.date(),
};

// 🔹 Crea un esquema Zod dinámico
export function createDynamicSchema(defs: FieldDefinition[]) {
  const shape: Record<string, ZodTypeAny> = {};

  for (const field of defs) {
    let zodType = zodTypeMap[field.type];

    // 🔸 Aplica validaciones personalizadas si tiene subType
    if (field.subType && field.type === "string") {
      const subVal = subTypeValidations[field.subType];
      if (subVal) {
        zodType = subVal;
      }
    }

    // 🔸 Campos opcionales
    if (!field.required) {
      zodType = zodType.optional();
    }

    shape[field.name] = zodType;
  }

  return z.object(shape);
}
