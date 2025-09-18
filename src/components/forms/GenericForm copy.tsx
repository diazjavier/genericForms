"use client";
import { Card, Heading, Flex, ScrollArea } from "@radix-ui/themes";

import FormFields from "@/components/forms/formsElements/FormFields";
import FormButtonComponent from "@/components/forms/formsElements/FormButton";
import { FormValues, FormData2} from "@/interfaces/forms";

import { useForm, Controller } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import SaveConfirm from "@/components/forms/formsElements/SaveConfirm";
import transformPOST from "@/utils/transformers/transformPOST"

function GenericForm(form: FormValues) {
  // const { formTitle, fields, buttons } = form;

  // // Referencia al formulario
  // const formRef = useRef<HTMLFormElement>(null);

  // //Genero los datos de los campos por default
  // const defaultValues = Object.fromEntries(
  //   fields.map((field) => [field.name, field.defaultValue ?? []])
  // );

  // //------------------------------------------------------
  // //----------   Revisar esto!! --------------------------
  // //------------------------------------------------------

  // const {
  //   control,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm({
  //   defaultValues: defaultValues,
  // });

  // //------------------------------------------------------
  // //------------------------------------------------------
  // //------------------------------------------------------

  // //Creamos un estado para guardar los datos del formulario
  // const [datos, setDatos] = useState<FormData2[]>([]);

  // //Creamos un estado para abrir la pantalla emergente de confirmación de guardado
  // const [open, setOpen] = useState<boolean>(false);

  // //Guardo los datos iniciales
  // const datosIniciales: FormData2[] = fields.map((field) => ({
  //   campo: field.name,
  //   valor: field.defaultValue ?? [""],
  // }));

  // //Esta función carga los datos inciales por defecto
  // const cargaDatosIniciales = () => {
  //   setDatos(datosIniciales);
  // };

  // //Cargo los datos iniciales al abrir el formualrio
  // useEffect(() => {
  //   cargaDatosIniciales();
  // }, []);

  // //Captura cambios en los controles hijos
  // const handleChange = async (
  //   e: React.ChangeEvent<
  //     HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  //   >,
  //   valores?: string[]
  // ) => {
  //   //Si el componente tiene un solo dato lo tomo de la propiedad value del elemento e.target
  //   //Pero si tiene un array de datos posibles como un checkGroup lo tomo del parámetro "valores" que es un array de strings que envío desde el form
  //   if (!valores) {
  //     setDatos((prev) =>
  //       prev.map((d) =>
  //         d.campo === e.target.name ? { ...d, valor: [e.target.value] } : d
  //       )
  //     );
  //   } else {
  //     setDatos((prev) =>
  //       prev.map((d) =>
  //         d.campo === e.target.name ? { ...d, valor: valores } : d
  //       )
  //     );
  //   }
  // };

  // const onSubmit2 = (e: React.FormEvent<HTMLFormElement>) => {
  //   {
  //     e.preventDefault();
  //     setOpen(true); //Abre la ventana emergente de confirmación
  //   }
  // };

  // const impactaDatos = (
  //   e: React.ChangeEvent<
  //     HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  //   >,
  //   losDatos: FormData2[]
  // ) => {
  //   {
  //     console.log(
  //       "La data del submit es: ",
  //       JSON.parse(JSON.stringify(losDatos, null, 2))
  //     );

  //     transformPOST(form, datos);

  //     formRef.current?.submit();
  //   }
  // };

  // return (
  //   <>
  //     <Card className="w-full">
  //       <ScrollArea type="always" scrollbars="vertical">
  //         {/* Título  */}
  //         <Heading size="6" className="mb-4 text-center p-4">
  //           {formTitle}
  //         </Heading>

  //         {/* Formulario */}
  //         {/*<form onSubmit={onSubmit2}>*/}
  //         <form ref={formRef} onSubmit={onSubmit2}>
  //           <Flex direction="column" gap="2" className="p-4">
  //             {/* Campos del formulario: 
  //               Cada campo recibe: 
  //               - Los datos propios del campo
  //               - Todos los datos inciales del formulario a ser modificados (datos)
  //               - La función de modificación (setDatos) 
  //           */}
  //             {fields.map((elField, index) => (
  //               <Controller
  //                 key={index}
  //                 name={elField.name}
  //                 control={control}
  //                 rules={{
  //                   required: {
  //                     value: elField.required ? elField.required : false,
  //                     message: `El campo ${elField.label} es obligatorio`,
  //                   },
  //                 }}
  //                 render={({ field }) => {
  //                   return (
  //                     <FormFields
  //                       key={index}
  //                       field={elField}
  //                       dataChange={handleChange}
  //                       {...field}
  //                     />
  //                   );
  //                 }}
  //               />
  //             ))}

  //             {/* Botones del formulario */}
  //             <Flex
  //               direction="row"
  //               gap="4"
  //               justify="between"
  //               className="my-4 w-full"
  //             >
  //               {buttons.map((button, index) => (
  //                 <FormButtonComponent key={index} boton={button} />
  //               ))}
  //             </Flex>
  //           </Flex>
  //         </form>
  //       </ScrollArea>
  //     </Card>

  //     <SaveConfirm
  //       onSave={impactaDatos}
  //       formValues={form}
  //       datos={datos}
  //       open={open}
  //       setOpen={setOpen}
  //     />
  //   </>
  // );
}

export default GenericForm;
