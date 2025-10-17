"use client";

import React from "react";
import { Link, Flex } from "@radix-ui/themes";
import NavLink from "next/link";
import GenericDataTable from "@/components/forms/GenericDataTable";
// import type { ColumnDef } from "@tanstack/react-table";
// import { useState } from "react";
// import { FormValues } from "@/interfaces/forms";
// import { useRouter, usePathname  } from "next/navigation";

export default function DataTablePage({
  params,
}: {
  params: Promise<{ entity: string }>;
}) {

  // const router = useRouter();
  // const pathname = usePathname(); 
  
  const { entity } = React.use(params);

  // const [form, setForm] = useState<FormValues | null>(null);
  // const [columnDefs, setColumnDefs] = useState<ColumnDef<any>[]>([]);
  // const [data, setData] = useState<any[]>([]);



  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Usuarios</h1>

      <GenericDataTable entity={entity}/>

      <Flex className="w-full p-4 text-sm">
        <Link asChild>
          <NavLink href="/">Volver</NavLink>
        </Link>
      </Flex>
    </div>
  );
}
