import { Flex, TextArea } from "@radix-ui/themes";
import { FormInputProps } from "@/interfaces/forms";

function FormTextArea({ field, dataChange }: FormInputProps) {
  const handleTextAreaChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    // Simula un evento para mantener la lógica centralizada
    const laData: string[] = e.target.value ? [e.target.value] : [];
    const fakeEvent = {
      target: { type: "input", name: field.name, value: laData },
    };
    dataChange(fakeEvent as any);
  };

  return (
    <Flex direction="column" gap="1" className="my-2">
      <label htmlFor={field.name}>{field.label}</label>
      <TextArea
        id={field.name}
        name={field.name}
        resize="vertical"
        required={field.required}
        placeholder={field.placeholder}
        value={field.value?.[0] ?? ""}
        autoFocus={field.autofocus}
        onChange={handleTextAreaChange}
      />
    </Flex>
  );
}

export default FormTextArea;
