"use client";
import { Card, Heading, Flex, ScrollArea } from "@radix-ui/themes";

import FormFields from "@/components/forms/formsElements/FormFields";
import FormButtonComponent from "@/components/forms/formsElements/FormButton";
import { FormValues, FormData2 } from "@/interfaces/forms";

import { useForm, Controller } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import SaveConfirm from "@/components/forms/formsElements/SaveConfirm";
import {generaQuery} from "@/utils/funciones/funcionesGenerales";

function GenericForm(formTemplate: FormValues) {
  // Referencia al formulario para limpiarlo con submit() despuésS
  const formRef = useRef<HTMLFormElement>(null);

  //------------------------------------------------------
  //----------   Revisar esto!! --------------------------
  //------------------------------------------------------

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  //------------------------------------------------------
  //------------------------------------------------------
  //------------------------------------------------------

  //Creamos un estado para guardar los datos del formulario
  const [form, setForm] = useState<FormValues>(formTemplate);
  // useEffect(() => {
  //   console.log("Campos nuevos: ", form.fields);
  // }, [form]);

  //Creamos un estado para abrir la pantalla emergente de confirmación de guardado
  const [open, setOpen] = useState<boolean>(false);

  //Captura cambios en los controles hijos
  const handleChange = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm(
      (prev: FormValues): FormValues => ({
        ...prev,
        fields: prev.fields.map((d) =>
          d.name === e.target.name ? { ...d, value: [e.target.value] } : d
        ),
      })
    );
  };

  const onSubmit2 = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOpen(true); //Abre la ventana emergente de confirmación
  };

  const impactaDatos = () => {
    // console.log(
    //   "La data del submit es: ",
    //   JSON.parse(JSON.stringify(form, null, 4))
    // );

    //Construimos el query
    const query = generaQuery(form);
    
    //Ejecutamos la acción que corresponda sobre la BD
    console.log(query);

    //Reseteo el formulario
    formRef.current?.submit();
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
          {/*<form onSubmit={onSubmit2}>*/}
          <form ref={formRef} onSubmit={onSubmit2}>
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
