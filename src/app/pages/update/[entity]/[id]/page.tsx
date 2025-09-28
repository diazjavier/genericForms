"use client";
import React from "react";
import { Container, Text, Link, Flex } from "@radix-ui/themes";
import NavLink from "next/link";
import GenericForm from "@/components/forms/GenericForm";
import { FormValues } from "@/interfaces/forms";
import { useState, useEffect } from "react";
import { buscaEditForm } from "@/utils/funciones/funcionesGenerales";

function UpdateEntity({
  params,
}: {
  params: Promise<{ entity: string; id: string }>;
}) {
  const { entity, id } = React.use(params);

  const [form, setForm] = useState<FormValues | null>(null);

  useEffect(() => {
    (async () => {
      const result = await buscaEditForm(entity, id); 
      setForm(result);
    })();
  }, []);

  if (!form) return <div>Cargando...</div>;

  return (
    <>
      <div className="flex h-screen w-auto justify-center items-center m-2">
        <Flex
          direction="column"
          gap="2"
          className="h-full w-full md:w-1/3 items-center"
        >
          {form && <GenericForm {...form} />}
          <Container size="1" className="w-full">
            <Flex justify="between" className="w-full p-4 text-sm">
              {/* <Text>No tiene una cuenta?</Text> */}
              <Link asChild>
                <NavLink href="/">Volver</NavLink>
              </Link>
            </Flex>
          </Container>
        </Flex>
      </div>
    </>
  );
}

export default UpdateEntity;
