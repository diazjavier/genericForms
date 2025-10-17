"use client";

import React from "react";
import { Link, Flex } from "@radix-ui/themes";
import NavLink from "next/link";
import GenericDataTable from "@/components/forms/GenericDataTable";

export default function DataTablePage({
  params,
}: {
  params: Promise<{ entity: string }>;
}) {
  
  const { entity } = React.use(params);

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
