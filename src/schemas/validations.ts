import { z } from "zod";

// 🔹 Validaciones específicas según subTipo
export const subTypeValidations: Record<string, z.ZodString> = {
  dni: z
    .string()
    .regex(/^\d{7,8}$/, "DNI inválido (7 u 8 dígitos)"),
  cuit: z
    .string()
    .regex(/^\d{2}-?\d{8}-?\d{1}$/, "CUIT inválido"),
  cuil: z
    .string()
    .regex(/^\d{2}-?\d{8}-?\d{1}$/, "CUIT inválido"),
  phone: z
    .string()
    .regex(/^\+?\d{7,15}$/, "Teléfono inválido"),
  email: z.string().email("Email inválido"),
};
