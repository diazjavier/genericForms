"use client";
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
import { DropdownMenu } from "radix-ui"; // shadcn dropdown
import { Plus, FileSpreadsheet } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { FilterFn } from "@tanstack/react-table";

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

export default function DataTable<TData>({
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
  // //Creamos un estado para abrir la pantalla emergente de confirmación de guardado
  // const [open, setOpen] = useState<boolean>(false);
  // const [flag, setFlag] = useState<boolean>();

  //Declaro un estado para el filtro de estado (all, active, inactive)
  const [statusFilter, setStatusFilter] = React.useState<
    "all" | "active" | "inactive"
  >("all");

  // --- MEMOIZAR data y columns con fallback para evitar undefined ---
  const dataMemo = React.useMemo(() => data ?? [], [data]);
  const baseColumns = React.useMemo(
    () => columns ?? ([] as ColumnDef<TData, any>[]),
    [columns]
  );

  //Filtro los datos por estado ANTES de dárselos a la tabla
  const filteredByStatus = React.useMemo(() => {
    if (statusFilter === "all") return dataMemo;
    if (statusFilter === "active")
      return dataMemo.filter((r) => (r as any).fechaFin === null);
    if (statusFilter === "inactive")
      return dataMemo.filter((r) => (r as any).fechaFin !== null);
    return dataMemo;
  }, [dataMemo, statusFilter]);

  // si se envía rowActions, añadimos una columna de acciones al final
  const columnsWithActions = React.useMemo(() => {
    if (!rowActions) return baseColumns;
    const actionCol: ColumnDef<TData, any> = {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => rowActions(row.original),
      enableSorting: false,
      size: 1,
    };
    return [...baseColumns, actionCol];
  }, [baseColumns, rowActions]);

  //Armo un filtro global que busque en todas las columnas
  const globalFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
    const search = filterValue.toLowerCase();
    // Une todos los valores del row en un solo string
    const rowString = Object.values(row.original).join(" ").toLowerCase();
    return rowString.includes(search);
  };

  const activeFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
    //Primero saco en que posición está el campo fechaFin
    const indexOfFechaFin = Object.keys(row.original).findIndex(
      (data) => data === "fechaFin"
    );

    //Muestro sólo las filas que tienen fechaFin en null (o sea las activas)
    const activesRows = Object.values(row.original)[indexOfFechaFin];
    return activesRows === null;
  };

  const inactiveFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
    //Primero saco en que posición está el campo fechaFin
    const indexOfFechaFin = Object.keys(row.original).findIndex(
      (data) => data === "fechaFin"
    );

    //Muestro sólo las filas que tienen fechaFin not null (o sea las inactivas)
    const inactivesRows = Object.values(row.original)[indexOfFechaFin];
    return inactivesRows !== null;
  };

  const table = useReactTable({
    data: filteredByStatus,
    columns: columnsWithActions,
    state: { globalFilter, sorting, pagination },
    globalFilterFn,
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
        <div className="flex flex-row gap-4 items-center">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="px-3 py-2 border rounded"
              >
                Opciones de visualización
              </Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content className="p-2 bg-white shadow rounded">
              <DropdownMenu.Item
                onClick={() => setStatusFilter("all")}
                role="menuitem"
                className="px-2 py-1 hover:bg-gray-100 rounded"
              >
                Todos
              </DropdownMenu.Item>

              <DropdownMenu.Item
                onClick={() => setStatusFilter("active")}
                role="menuitem"
                className="px-2 py-1 hover:bg-gray-100 rounded"
              >
                Activos
              </DropdownMenu.Item>

              <DropdownMenu.Item
                onClick={() => setStatusFilter("inactive")}
                role="menuitem"
                className="px-2 py-1 hover:bg-gray-100 rounded"
              >
                Inactivos
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>

          <span size= "sm" className="text-sm font-bold rounded-md bg-gray-50 border-blue-900-2 p-2 text-gray-600">
            {statusFilter === "all"
              ? "TODOS"
              : statusFilter === "active"
              ? "ACTIVOS"
              : "INACTIVOS"}
          </span>
        </div>

        <div>
          <span className="text-sm text-gray-600">
            {table.getFilteredRowModel().rows.length} registros
          </span>
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
            {(table?.getHeaderGroups?.() ?? []).map((hg) => (
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
                  {row.getVisibleCells().map((cell) => {
                    const headerName = cell.column.columnDef.header;
                    return (
                      <td key={cell.id} className="px-4 py-2 text-sm text-left">
                        {headerName === "Estado" ? (
                          cell.getValue() === null ? (
                            <Badge className="bg-green-100 text-green-800 border-green-300">
                              Activo
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 border-red-300">
                              Inactivo
                            </Badge>
                          )
                        ) : (
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )
                        )}
                      </td>
                    );
                  })}
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
