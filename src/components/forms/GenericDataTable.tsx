"use client";
// components/data-table/DataTable.tsx
import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input"; // shadcn input
import { Button } from "@/components/ui/button"; // shadcn button
import { Plus } from "lucide-react";
import { FileSpreadsheet } from "lucide-react";
import { useRouter } from "next/navigation";

type DataTableProps<TData> = {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  pageSize?: number;
  enableSorting?: boolean;
  enablePagination?: boolean;
  /**
   * rowActions recibirá la fila original y debe devolver ReactNode con botones (editar, borrar, ...)
   * Ej: row => <Button onClick={() => edit(row)}>Editar</Button>
   */
  rowActions?: (row: TData) => React.ReactNode;
  onRowClick?: (row: TData) => void;
  className?: string;
  entity?: string;
};

export default function GenericDataTable<TData>({
  columns,
  data,
  pageSize = 10,
  enableSorting = true,
  enablePagination = true,
  rowActions,
  onRowClick,
  className,
  entity,
}: DataTableProps<TData>) {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize,
  });

  const router = useRouter();

  // si se envía rowActions, añadimos una columna de acciones al final
  const columnsWithActions = React.useMemo(() => {
    if (!rowActions) return columns;
    const actionCol: ColumnDef<TData, any> = {
      id: "actions",
      header: "",
      cell: ({ row }) => rowActions(row.original),
      enableSorting: false,
      size: 1,
    };
    return [...columns, actionCol];
  }, [columns, rowActions]);

  const table = useReactTable({
    data,
    columns: columnsWithActions,
    state: { globalFilter, sorting, pagination },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableSorting,
  });

  // Export CSV de las filas actualmente visibles (filtradas + ordenadas)
  const exportCSV = () => {
    const rows = table.getRowModel().rows;
    if (!rows.length) return;
    const headers = table
      .getAllLeafColumns()
      .map((c) =>
        typeof c.columnDef.header === "string" ? c.columnDef.header : c.id
      );
    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        table
          .getAllLeafColumns()
          .map((c) => {
            const v = r.getValue(c.id as any);
            // escapado básico
            return typeof v === "string"
              ? `"${v.replace(/"/g, '""')}"`
              : v ?? "";
          })
          .join(",")
      ),
    ].join("\n");

    const bom = "\uFEFF";
    const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `export.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={className}>
      {/* Controls (search + export) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Buscar..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="min-w-[180px]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={exportCSV}
            variant="outline" // mismo estilo de borde
            className="flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-green-600" />
            Exportar CSV
          </Button>
          <Button
            onClick={() => router.push(`/pages/new/${entity}`)}
            className="bg-sky-600 hover:bg-sky-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear nuevo
          </Button>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded border">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="px-4 py-2 text-left text-sm font-semibold"
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center gap-2 select-none">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() ? (
                          <button
                            onClick={header.column.getToggleSortingHandler()}
                            className="text-xs opacity-60"
                            aria-label="toggle sort"
                          >
                            {header.column.getIsSorted() === "asc"
                              ? " 🔼"
                              : header.column.getIsSorted() === "desc"
                              ? " 🔽"
                              : " ↕"}
                          </button>
                        ) : null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="bg-white divide-y">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 cursor-default"
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2 text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={table.getAllLeafColumns().length}
                  className="p-4 text-sm text-gray-500"
                >
                  No hay datos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {enablePagination && (
        <div className="flex items-center justify-between gap-2 pt-4">
          <div className="text-sm text-gray-600">
            Mostrando{" "}
            <strong>
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
            </strong>{" "}
            -{" "}
            <strong>
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}
            </strong>{" "}
            de <strong>{table.getFilteredRowModel().rows.length}</strong>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              variant="outline"
            >
              Primero
            </Button>
            <Button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              variant="outline"
            >
              Anterior
            </Button>
            <Button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              variant="outline"
            >
              Siguiente
            </Button>
            <Button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              variant="outline"
            >
              Último
            </Button>

            <select
              className="ml-2 rounded border px-2 py-1"
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
              {[5, 10, 20, 50].map((s) => (
                <option key={s} value={s}>
                  {s} / pág
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
