"use client";

import * as Popover from "@radix-ui/react-popover";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";

import { Flex, TextField } from "@radix-ui/themes";
import { CalendarIcon } from "@radix-ui/react-icons";
import { FormInputProps } from "@/interfaces/forms";
import { useState } from "react";

function FormDatePicker({ field, dataChange }: FormInputProps) {
  //Si hay una fecha por default la muestro, si no muestro la fecha de actual
  // const fechaAMostrar: Date = field.defaultValue
  //   ? new Date(field.defaultValue[0])
  //   : new Date();
  const fechaAMostrar: Date = field.value
    ? new Date(field.value[0])
    : new Date();

  const [laDate, setLaDate] = useState<Date | undefined>(fechaAMostrar);
  const [open, setOpen] = useState(false);

  // Esta función adapta la fecha seleccionada al formato del estado
  const handleSelect = (date: Date | undefined) => {
    //Cambio la fecha en el campo del formulario
    setLaDate(date);

    //Mando la nueva fecha al set de datos del formulario
    // Simula un evento para mantener la lógica centralizada
    const laData: string[] = date ? [date.toISOString() + "T00:00:00"] : [];
    const fakeEvent = {
      target: { type: "select", name: field.name, value: laData },
    };
    //dataChange(fakeEvent as any, arrValue);
    dataChange(fakeEvent as any);
  };

  return (
    <Flex direction="column" gap="1" className="my-2">
      <label htmlFor={field.name}>{field.label}</label>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <TextField.Root
            className="text-left text-sm border border-gray-300 p-2 rounded"
            value={laDate ? format(laDate.toISOString(), "dd/MM/yyyy") : ""}
          >
            <TextField.Slot>
              <CalendarIcon height={16} width={16} />
            </TextField.Slot>
          </TextField.Root>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className="bg-white p-3 rounded-lg shadow-lg border"
            sideOffset={5}
          >
            <DayPicker
              mode="single"
              selected={laDate}
              onSelect={(date) => {
                handleSelect(date);
                setOpen(false);
              }}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </Flex>
  );
}

export default FormDatePicker;
