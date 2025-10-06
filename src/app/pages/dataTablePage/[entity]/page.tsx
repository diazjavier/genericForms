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
  traeColumnDefs,
} from "@/utils/funciones/funcionesGenerales";
import { useState, useEffect } from "react";
import { FormValues } from "@/interfaces/forms";
import { useRouter, usePathname  } from "next/navigation";

export default function DataTablePage({
  params,
}: {
  params: Promise<{ entity: string }>;
}) {

  const router = useRouter();
  const pathname = usePathname(); 
  
  const { entity } = React.use(params);

  const [form, setForm] = useState<FormValues | null>(null);
  const [columnDefs, setColumnDefs] = useState<ColumnDef<any>[]>([]);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const formData = await buscaForm(entity, "GET");
      if (!formData) {
        // manejar el caso (setear un estado de error/empty) en lugar de devolver JSX aquí
        setForm(null);
        setColumnDefs([]);
        setData([]);
        return;
      }

      setForm(formData);
      
      const cols = await traeColumnDefs(formData);
      setColumnDefs(cols);

      const dataFetched = await buscaEntityData(formData);
      setData(dataFetched ?? []);

    })();
  }, []);

  if (!form) return <div>Cargando...</div>;

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
              onClick={() => router.push(`/pages/update/${entity}/${row.id}?from=${encodeURIComponent(pathname)}`)}
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
        entity={entity}
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
