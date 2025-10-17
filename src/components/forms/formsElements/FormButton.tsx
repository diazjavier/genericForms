import { Flex, Button } from "@radix-ui/themes";
import { FormButton } from "@/interfaces/forms";
import { useRouter, useSearchParams } from "next/navigation";

interface FormButtonProps {
  boton: FormButton;
  accion?: () => void;
}

function FormButtonComponent({ boton }: FormButtonProps) {
  const router = useRouter();

  // Obtener parámetro "from" de la URL para redireccionar después de guardar
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  function handleOnClick() {
    if (boton.type === "reset") {
      router.push(from ?? "/");
      return;
    }
    return;
  }

  return (
    <div>
      <Flex direction="column" className="my-4 w-full">
        <Button
          color={boton.color ? boton.color : "gray"}
          className="w-100%"
          type={boton.type ? boton.type : "button"}
          onClick={handleOnClick}
        >
          {boton.label}
        </Button>
      </Flex>
    </div>
  );
}

export default FormButtonComponent;
