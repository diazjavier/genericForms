import { Flex, CheckboxGroup } from "@radix-ui/themes";
import { FormInputProps } from "@/interfaces/forms";

function FormCheckboxGroup({ field, dataChange }: FormInputProps) {
  //Esta función hace una trampa y permite reutilizar handleChange con un checkbox
  // Captura el cambio en un CheckboxGroup de Radix UI
  const handleCheckChange = (laData: string[]) => {
    // Simula un evento para mantener la lógica centralizada
    const fakeEvent = {
      target: { type: "checkbox", name: field.name, value: laData },
    };
    dataChange(fakeEvent as any);
  };

  return (
    <Flex direction="column" gap="1" className="my-2">
      <label htmlFor={field.name}>{field.label}</label>
      <CheckboxGroup.Root
        orientation="vertical"
        //defaultValue={field.defaultValue ?? [""]}
        value={field.value ?? [""]}
        name={field.name}
        className="border border-gray-300 p-4 rounded"
        onValueChange={handleCheckChange}
      >
        {field.options &&
          field.options.map((option) => (
            <Flex
              key={`${field.name}'-'${option.value}`}
              align="center"
              gap="2"
            >
              <CheckboxGroup.Item
                value={option.value}
                id={`${field.name}'-'${option.value}`}
              />
              {option.label}
            </Flex>
          ))}
      </CheckboxGroup.Root>
    </Flex>
  );
}

export default FormCheckboxGroup;
