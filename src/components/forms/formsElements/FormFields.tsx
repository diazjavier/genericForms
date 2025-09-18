"use client";

import FormInput from "./FormInput";
import FormDatePicker from "./FormDatepicker";
import FormTextArea from "./FormTextArea";
import FormSelect from "./FormSelect";
import FormCheckboxGroup from "./FormCheckboxGroup";
import FormRadioGroup from "./FormRadioGroup";

import { FormInputProps } from "@/interfaces/forms";

function FormFields({ field, dataChange }: FormInputProps) {
  // A todo lo que no sea email o password, lo convertimos a text
  // Si el fieldType es 'input' o undefined, renderizamos un TextField
  if (field.fieldType === "input" || !field.fieldType) {
    return (
      <FormInput
        field={field}
        dataChange={dataChange}
        {...field}
      />
    );
  }

  // Si el fieldType es 'textarea', renderizamos un TextArea
  if (field.fieldType === "textarea") {
    return (
      <FormTextArea
        field={field}
        dataChange={dataChange}
        {...field}
      />
    );
  }

  // Si el fieldType es 'select', renderizamos un Select
  if (field.fieldType === "select") {
    return (
      <FormSelect
        field={field}
        dataChange={dataChange}
        {...field}
      />
    );
  }

  // Si el fieldType es 'checkbox', renderizamos un CheckboxGroup
  if (field.fieldType === "checkbox") {
    return (
      <FormCheckboxGroup
        field={field}
        dataChange={dataChange}
        {...field}
      />
    );
  }

  // Si el fieldType es 'radio', renderizamos un RadioGroup
  if (field.fieldType === "radio") {
    return (
      <FormRadioGroup
        field={field}
        dataChange={dataChange}
        {...field}
      />
    );
  }

  // Si el fieldType es 'datepicker', renderizamos un DatePicker
  if (field.fieldType === "datepicker") {
    return (
      <FormDatePicker field={field} dataChange={dataChange} {...field}/>
    );
  }

  return <div>Tipo de campo no soportado</div>;
}

export default FormFields;
