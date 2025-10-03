"use client";

// pages/users/index.tsx
import React from "react";
import { Link, Flex } from "@radix-ui/themes";
import NavLink from "next/link";
import GenericDataTable from "@/components/forms/GenericDataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  buscaForm,
  buscaEntityData,
} from "@/utils/funciones/funcionesGenerales";
import { createDynamicSchema } from "@/schemas/genericSchemas";
import { transformFieldsToSchemaDef } from "@/schemas/fieldTransform";
import { z } from "zod";
import { useState, useEffect } from "react";
import { FormValues } from "@/interfaces/forms";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

const users: User[] = [
  {
    id: 1,
    name: "Ana Pérez",
    email: "ana@example.com",
    role: "admin",
    createdAt: "2025-09-01",
  },
  {
    id: 2,
    name: "Diego Gómez",
    email: "diego@example.com",
    role: "usuario",
    createdAt: "2025-08-20",
  },
  {
    id: 3,
    name: "Ana Pérez",
    email: "ana@example.com",
    role: "admin",
    createdAt: "2025-09-01",
  },
  {
    id: 4,
    name: "Diego Gómez",
    email: "diego@example.com",
    role: "usuario",
    createdAt: "2025-08-20",
  },
  {
    id: 5,
    name: "Ana Pérez",
    email: "ana@example.com",
    role: "admin",
    createdAt: "2025-09-01",
  },
  {
    id: 67,
    name: "Diego Gómez",
    email: "diego@example.com",
    role: "usuario",
    createdAt: "2025-08-20",
  },
];

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Rol",
  },
  {
    accessorKey: "createdAt",
    header: "Creado",
    cell: (info) => new Date(info.getValue() as string).toLocaleDateString(),
  },
];

export default async function DataTablePage({
  params,
}: {
  params: Promise<{ entity: string }>;
}) {
  const { entity } = React.use(params);

  const [form, setForm] = useState<FormValues | null>(null);

  const formData = await buscaForm(entity, "GET");
  if (!formData) return <div>No se encontró la entidad de referencia</div>;

  useEffect(() => {
    (async () => {
      const result: FormValues | null = await buscaEntityData(entity, formData);
      if (!result) return <div>No se encontraron datos para la entidad</div>;
      setForm(result);
    })();
  }, []);

  if (!form) return <div>Cargando...</div>;

  const defs = transformFieldsToSchemaDef(formData.fields);
  const GenericSchema = createDynamicSchema(defs);
  type elType = z.infer<typeof GenericSchema>;
  const GenericArraySchema = z.array(GenericSchema);
  type GenericArray = z.infer<typeof GenericArraySchema>;

function traeDatosDataTable(form: FormValues): any[] {
  if (!form || !form.fields) return [];
    const numRows = form.fields[0].value ? form.fields[0].value.length : 0;
    const dataTable: any[] = [];
    for (let i = 0; i < numRows; i++) {
      const row: any = {}; 
        form.fields.forEach((field) => {
            if (field.campoTabla) {
                row[field.campoTabla] = field.value ? field.value[i] : null;
            }
        });
      dataTable.push(row);
    }
    return dataTable;
}

function traeColumnDefs(form: FormValues): any[] {
  if (!form || !form.fields) return [];
    const columnDefs: any[] = form.fields
      .filter((field) => field.campoTabla)
      .map((field) => ({
        accessorKey: field.campoTabla,
        header: field.label,
        cell: (info: any) => info.getValue(),
      }));
    return columnDefs;
}   










  //Armar el JSON con los datos
  const data: elType[] = traeDatosDataTable(form);

  //Armar el JSON con las cabeceras
  const columnDefs: ColumnDef<elType>[] = traeColumnDefs(form);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Usuarios</h1>

      <GenericDataTable
        columns={columnDefs}
        data={data}
        pageSize={5}
        rowActions={(row) => (
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="text-sky-600 hover:text-sky-800"
              onClick={() => alert(`Editar ${row.id}`)}
            >
              <Pencil className="w-4 h-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="text-sky-600 hover:text-sky-800"
              onClick={() => alert(`Borrar ${row.id}`)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
        onRowClick={(row) => console.log("fila clickeada", row)}
      />

      <Flex className="w-full p-4 text-sm">
        {/* <Text>No tiene una cuenta?</Text> */}
        <Link asChild>
          <NavLink href="/">Volver</NavLink>
        </Link>
      </Flex>
    </div>
  );
}
