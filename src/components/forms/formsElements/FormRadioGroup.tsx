import { Flex, RadioGroup } from "@radix-ui/themes";
import { FormInputProps } from "@/interfaces/forms";

function FormRadioGroup({ field, dataChange }: FormInputProps) {
  //Esta función hace una trampa y permite reutilizar handleChange con un checkbox
  // Captura el cambio en un OptionGroup de Radix UI
  const handleOptionChange = (optionValues: string) => {
    const laData: string[] = [optionValues];
    const fakeEvent = {
      target: { type: "radio", name: field.name, value: laData },
    };
    //dataChange(fakeEvent as any, arrValue);
    dataChange(fakeEvent as any);
  };

  return (
    <Flex direction="column" gap="1" className="my-2">
      <label htmlFor={field.name}>{field.label}</label>
      <RadioGroup.Root
        orientation="vertical"
        //defaultValue={field.defaultValue?.[0] ?? ""}
        value={field.value?.[0] ?? ""}
        name={field.name}
        className="border border-gray-300 p-4 rounded"
        onValueChange={handleOptionChange}
      >
        {field.options &&
          field.options.map((option) => (
            <Flex
              key={`${field.name}'-'${option.value}`}
              align="center"
              gap="2"
            >
              <RadioGroup.Item
                value={option.value}
                id={`${field.name}'-'${option.value}`}
              />
              {option.label}
            </Flex>
          ))}
      </RadioGroup.Root>
    </Flex>
  );
}

export default FormRadioGroup;
