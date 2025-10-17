"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  buscaForm,
  buscaEntityData,
  traeColumnDefs,
} from "@/utils/funciones/funcionesGenerales";

import { Button } from "@/components/ui/button"; // shadcn button
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import DeleteConfirm from "@/components/forms/formsElements/DeleteConfirm";
import RestoreConfirm from "@/components/forms/formsElements/RestoreConfirm";
import { toast } from "sonner";
import DataTable from "@/components/forms/DataTable";
import { Pencil, Trash2, RotateCcw } from "lucide-react";
import { FormValues } from "@/interfaces/forms";
import transformDELETE from "@/utils/transformers/transformDELETE";
import transformGET from "@/utils/transformers/transformGET";
import transformPUT from "@/utils/transformers/transformPUT";
import transformRESTORE from "@/utils/transformers/transformRESTORE";

type GDTProps = {
  entity: string;
};

function GenericDataTable({ entity }: GDTProps) {
  const router = useRouter();
  const pathname = usePathname();
  //Creamos un estado para abrir la pantalla emergente de confirmación de guardado
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [openRestore, setOpenRestore] = useState<boolean>(false);
  const [flag, setFlag] = useState<boolean>();
  const [form, setForm] = useState<FormValues | null>(null);
  const [columnDefs, setColumnDefs] = useState<ColumnDef<any>[]>([]);
  const [data, setData] = useState<any[]>([]);
  //Creamos un estado para armar la Query
  const [query, setQuery] = useState<string>();
  const [rowId, setRowId] = useState<number | undefined>();
  const [refreshFlag, setRefreshFlag] = useState<boolean>(false);

  // Efecto 1: cargar form/columns/data cuando cambie entity
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const formData = await buscaForm(entity, "GET");
        if (!mounted) return;
        if (!formData) {
          setForm(null);
          setColumnDefs([]);
          setData([]);
          return;
        }
        setForm(formData);

        const cols = await traeColumnDefs(formData);
        if (!mounted) return;
        setColumnDefs(cols ?? []);

        const dataFetched = await buscaEntityData(formData);
        if (!mounted) return;
        setData(dataFetched ?? []);
      } catch (err) {
        console.error("Error cargando GenericDataTable:", err);
        if (!mounted) return;
        setForm(null);
        setColumnDefs([]);
        setData([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [entity, refreshFlag]);

  // Efecto 2: reaccionar a flag (siempre declarado; su cuerpo valida form)
  useEffect(() => {
    // IMPORTANTE: el hook existe siempre; aquí evitamos ejecutar la lógica si form no está listo
    if (!form) return;
    if (flag === true) {
      (async () => {
        try {
          if (form.action === "PUT") {
            const laQuery = await transformPUT(form);
            setQuery(laQuery);
          }
          if (form.action === "GET") {
            const laQuery = await transformGET(form);
            setQuery(laQuery);
          }
          // Si añadís POST o DELETE, manejalos aquí también
        } catch (err) {
          console.error("Error en efecto flag:", err);
        } finally {
          // reseteá flag si querés que la acción sea una sola vez
          setFlag(false);
        }
      })();
    }
  }, [flag, form]);

  useEffect(() => {
    if (!query) return;

    let mounted = true;

    //Tengo que hacerlo así porque no puedo llamar a una función async directamente desde useEffect
    const fetchData = async () => {
      try {
        if (mounted) {
          await fetchGenericPOST();
        }
      } catch (error) {
        console.error("Error en fetchGenericPOST:", error);
      }
    };
    fetchData();
    setRefreshFlag(!refreshFlag);
    //Esto es por si el componente se desmonta antes de que termine la llamada fetch
    return () => {
      mounted = false;
    };
  }, [query]);

  const fetchGenericPOST = async () => {
    const apiUrl: string = `http://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/api/generic/post`;
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query, form }),
    });

    if (!res.ok) {
      toast.error(`Error en la API: ${res.status} - ${await res.text()}`);
      throw new Error(`Error en la API: ${res.status} - ${await res.text()}`);
    }

    toast.success("Los datos se guardaron con éxito");

    const response = await res.json();
    return response;
  };

  const impactaDatos = async () => {
    setFlag(true);
  };

  const impactaDelete = async () => {
    if (!form) return;
    const laQuery = transformDELETE(form.table ?? "", rowId?.toString() ?? "");
    setQuery(laQuery);
  };

  const impactaRestore = async () => {
    if (!form) return;
    const laQuery = transformRESTORE(form.table ?? "", rowId?.toString() ?? "");
    setQuery(laQuery);
  };

  return (
    <>
      <DataTable
        columns={columnDefs ?? []}
        data={data ?? []}
        pageSize={20}
        rowActions={(row) => (
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="text-sky-600 hover:text-sky-800"
              onClick={() =>
                router.push(
                  `/pages/update/${entity}/${row.id}?from=${encodeURIComponent(
                    pathname
                  )}`
                )
              }
            >
              <Pencil className="w-4 h-4" />
            </Button>
            {row.fechaFin ? (
              <Button
                size="icon"
                variant="ghost"
                className="text-sky-600 hover:text-sky-800"
                onClick={() => setOpenRestore(true)} // Abre el diálogo de confirmación
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                size="icon"
                variant="ghost"
                className="text-sky-600 hover:text-sky-800"
                onClick={() => setOpenDelete(true)} // Abre el diálogo de confirmación
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
        onRowClick={(row) => setRowId(row.id)}
        entity={entity}
      />
      <DeleteConfirm
        onSave={impactaDelete}
        open={openDelete}
        setOpen={setOpenDelete}
        //id={rowId ?? undefined}
      />
      <RestoreConfirm
        onSave={impactaRestore}
        open={openRestore}
        setOpen={setOpenRestore}
        //id={rowId ?? undefined}
      />
    </>
  );
}
export default GenericDataTable;
