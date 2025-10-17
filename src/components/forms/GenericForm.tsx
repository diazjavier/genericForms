"use client";
import { Card, Heading, Flex, ScrollArea } from "@radix-ui/themes";

import FormFields from "@/components/forms/formsElements/FormFields";
import SaveConfirm from "@/components/forms/formsElements/SaveConfirm";
import FormButtonComponent from "@/components/forms/formsElements/FormButton";
import { DataValidation, FormValues } from "@/interfaces/forms";

import { useForm, Controller } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import transformPOST from "@/utils/transformers/transformPOST";
import transformPUT from "@/utils/transformers/transformPUT";
import transformDELETE from "@/utils/transformers/transformDELETE";
import { validaDatos } from "@/utils/funciones/funcionesGenerales";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

function GenericForm(formTemplate: FormValues) {
  // Referencia al formulario para limpiarlo con submit() despuésS
  const formRef = useRef<HTMLFormElement>(null);

  const router = useRouter();

  // Obtener parámetro "from" de la URL para redireccionar después de guardar
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  //------------------------------------------------------
  //----------   Revisar esto!! --------------------------
  //------------------------------------------------------

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: formTemplate.fields.reduce((acc, f) => {
      acc[f.name] = f.value?.[0] || "";
      return acc;
    }, {} as Record<string, any>),
  });

  //------------------------------------------------------
  //------------------------------------------------------
  //------------------------------------------------------

  //Creamos un estado para guardar los datos del formulario
  const [form, setForm] = useState<FormValues>(formTemplate);

  // Función async para guardar los datos:
  //Uso la misma función para POST y PUT porque me permite enviar una query tanto para un insert como para un update en el mismo body
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

  //Creamos un estado para abrir la pantalla emergente de confirmación de guardado
  const [open, setOpen] = useState<boolean>(false);

  //Creamos un estado para armar la Query
  const [query, setQuery] = useState<string>();

  useEffect(() => {
    if (flag === true) {
      (async () => {
        switch (form.action) {
          case "POST":
            await fetchGenericPOST();
            break;
          case "PUT":
            await fetchGenericPOST();
            break;
        }
      })();

      //Vuelvo a la página de origen
      router.push(from ?? "/");
    }
  }, [query]);

  const [flag, setFlag] = useState<boolean>();

  useEffect(() => {
    if (flag === true) {
      if (form.action === "POST") {
        (async () => {
          const laQuery = await transformPOST(form);
          setQuery(laQuery);
        })();
      }
      if (form.action === "PUT") {
        (async () => {
          const laQuery = await transformPUT(form);
          setQuery(laQuery);
        })();
      }
      if (form.action === "DELETE") {
        (async () => {
          const laQuery = await transformDELETE(
            form.table ?? "",
            form.id?.toString() ?? ""
          );
          setQuery(laQuery);
        })();
      }
    }
  }, [flag]);

  //Captura cambios en los controles hijos
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    // Si es un checkbox, el value es un array de strings, si no lo transformo en un array con un solo string
    const checkValues: string[] = Array.isArray(e.target.value)
      ? e.target.value
      : [e.target.value];
    setForm(
      (prev: FormValues): FormValues => ({
        ...prev,
        fields: prev.fields.map((d) =>
          d.name === e.target.name ? { ...d, value: checkValues } : d
        ),
      })
    );
  };

  const onSubmit2 = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOpen(true); //Abre la ventana emergente de confirmación
  };

  const impactaDatos = async () => {
    const datosValidados: DataValidation[] = await validaDatos(form);
    if (datosValidados[0].validation) {
      //Tengo que hacerlo así por el lío de los async/await que genera bcrypt al encriptar la contraseña
      setFlag(true);
    } else {
      toast.error(datosValidados[0].message);
    }
  };

  return (
    <>
      <Card className="w-full">
        <ScrollArea type="always" scrollbars="vertical">
          {/* Título  */}
          <Heading size="6" className="mb-4 text-center p-4">
            {form.formTitle}
          </Heading>

          {/* Formulario */}
          <form ref={formRef} onSubmit={onSubmit2} onReset={() => reset()}>
            <Flex direction="column" gap="2" className="p-4">
              {/* Campos del formulario: 
                Cada campo recibe: 
                - Los datos propios del campo
                - Todos los datos inciales del formulario a ser modificados (datos)
                - La función de modificación (setDatos) 
            */}
              {form.fields.map((elField, index) => (
                <Controller
                  key={index}
                  name={elField.name}
                  control={control}
                  rules={{
                    required: {
                      value: elField.required ? elField.required : false,
                      message: `El campo ${elField.label} es obligatorio`,
                    },
                  }}
                  render={({ field }) => {
                    return (
                      <FormFields
                        key={index}
                        field={elField}
                        dataChange={handleChange}
                        {...field}
                      />
                    );
                  }}
                />
              ))}

              {/* Botones del formulario */}
              <Flex
                direction="row"
                gap="4"
                justify="between"
                className="my-4 w-full"
              >
                {form.buttons.map((button, index) => (
                  <FormButtonComponent key={index} boton={button} />
                ))}
              </Flex>
            </Flex>
          </form>
        </ScrollArea>
      </Card>

      <SaveConfirm onSave={impactaDatos} open={open} setOpen={setOpen} />
    </>
  );
}

export default GenericForm;
