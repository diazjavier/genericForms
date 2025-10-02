"use client";

// pages/users/index.tsx
import React from "react";
import { Container, Text, Link, Flex } from "@radix-ui/themes";
import NavLink from "next/link";
import GenericDataTable from "@/components/forms/GenericDataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { buscaForm, buscaEntityData } from "@/utils/funciones/funcionesGenerales";

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

export default async function DataTablePage({ params }: { params: Promise<{ entity: string }>}) {
  const { entity } = React.use(params);
  const formData = await buscaForm(entity);

  if (!formData) return <div>No se encontró la entidad de referencia</div>; 

  const data = await buscaEntityData(entity, formData);
  
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Usuarios</h1>

      <GenericDataTable
        columns={columns}
        data={users}
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
