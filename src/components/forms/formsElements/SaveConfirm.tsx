import * as AlertDialog from "@radix-ui/react-alert-dialog";
//import { Flex, Button, Card } from "@radix-ui/themes";
import { FormValues, FormData2 } from "@/interfaces/forms";

interface SaveConfirmProps {
  onSave: (
    // e: React.ChangeEvent<
    //   HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    // >,
    //losDatos: FormData2[]
  ) => void;
  //formValues: FormValues;
  //datos: FormData2[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function SaveConfirm({
  onSave,
  //formValues,
  //datos,
  open,
  setOpen,
}: SaveConfirmProps) {

//   const handleSave = () => {
//     // const fakeEvent = {
//     //   target: { type: "form", formValues },
//     // };
//     onSave(
//         //fakeEvent as any, 
//         //datos
//     );
//   };

  const seteaOpen = () => {
    setOpen(!open);
  };

  return (
    <div>
      <AlertDialog.Root open={open} onOpenChange={seteaOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="bg-black/50 fixed inset-0" />
          <AlertDialog.Content className="bg-white p-6 rounded shadow-md fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md">
            <AlertDialog.Title className="font-bold text-lg">
              ¿Guardar cambios?
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-gray-600">
              Estás a punto de guardar la información del formulario. ¿Deseas
              continuar?
            </AlertDialog.Description>
            
            <div className="mt-4 flex justify-between gap-2">
              <AlertDialog.Cancel asChild>
                <button className="px-4 py-2 rounded border bg-gray-400 text-white">Cancelar</button>
              </AlertDialog.Cancel>

              <AlertDialog.Action asChild>
                <button
                  onClick={onSave}
                  className="px-4 py-2 rounded bg-green-600 text-white"
                >
                  Confirmar
                </button>
              </AlertDialog.Action>
            </div> 
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
}

export default SaveConfirm;
