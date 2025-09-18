import {
  AvatarIcon,
  EnvelopeClosedIcon,
  LockClosedIcon,
} from "@radix-ui/react-icons";

import { Flex, Button } from "@radix-ui/themes";
import { FormButton } from "@/interfaces/forms";

interface FormButtonProps {
  boton: FormButton;
  accion?: () => void;
}

function FormButtonComponent({ boton }: FormButtonProps) {

  return (
    <div>
      <Flex direction="column" className="my-4 w-full">
        <Button
          color={boton.color ? boton.color : "gray"}
          className="w-100%"
          type={boton.type ? boton.type : "button"}
        >
          {boton.label}
        </Button>
      </Flex>
    </div>
  );
}

export default FormButtonComponent;
