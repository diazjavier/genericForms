import { Flex, TextField } from "@radix-ui/themes";
import {
  AvatarIcon,
  EnvelopeClosedIcon,
  LockClosedIcon,
} from "@radix-ui/react-icons";
import { FormInputProps } from "@/interfaces/forms";

function FormInput({ field, dataChange }: FormInputProps) {

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    // Simula un evento para mantener la lógica centralizada
    const laData: string[] = e.target.value ? [e.target.value] : [];
    const fakeEvent = {
      target: { type: "input", name: field.name, value: laData },
    };
    //dataChange(fakeEvent as any, arrValue);
    dataChange(fakeEvent as any);
  };

  return (
    <Flex direction="column" gap="1" className="my-2">
      <label htmlFor={field.name}>{field.label}</label>
      <TextField.Root
        id={field.name}
        name={field.name}
        type={field.type ? field.type : "text"}
        required={field.required}
        placeholder={field.placeholder}
        //defaultValue={field.defaultValue?.[0] ?? ""}
        value={field.value?.[0] ?? ""}
        autoFocus={field.autofocus}
        onChange={handleInputChange}
      >
        <TextField.Slot>
          {field.subType === "user" ? (
            <AvatarIcon height={16} width={16} />
          ) : field.subType === "email" ? (
            <EnvelopeClosedIcon height={16} width={16} />
          ) : field.subType === "password" ? (
            <LockClosedIcon height={16} width={16} />
          ) : undefined}
        </TextField.Slot>
      </TextField.Root>
    </Flex>
  );
}

export default FormInput;
