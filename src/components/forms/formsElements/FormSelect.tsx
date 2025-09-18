import { Flex, Select } from "@radix-ui/themes";
import { FormInputProps } from "@/interfaces/forms";

function FormSelect({ field, dataChange }: FormInputProps) {

  //Esta función hace una trampa y permite reutilizar handleChange con un select
  const handleSelectChange = (value: string) => {
    // Simula un evento para mantener la lógica centralizada
    const laData: string[] = [value];
    const fakeEvent = {
      target: { type: "select", name: field.name, value: laData },
    };
    //dataChange(fakeEvent as any, arrValue);
    dataChange(fakeEvent as any);
  };

  return (
    <Flex direction="column" gap="2" className="my-4">
      <label htmlFor={field.name}>{field.label}</label>
      <Select.Root
        name={field.name}
        required={field.required}
        //defaultValue={field.defaultValue?.[0] ?? ""}
        value={field.value?.[0] ?? ""}
        onValueChange={handleSelectChange}
      >
        <Select.Trigger
          autoFocus={field.autofocus}
          placeholder={field.placeholder}
        />
        <Select.Content position="popper">
          {field.options &&
            field.options.map((option, index) => (
              <Select.Item
                key={`${field.name}'-'${option.value}`}
                value={option.value}
              >
                {option.label}
              </Select.Item>
            ))}
        </Select.Content>
      </Select.Root>
    </Flex>
  );
}

export default FormSelect;
