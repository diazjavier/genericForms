import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Trash2 } from "lucide-react";

interface DeleteConfirmProps {
  onSave: () => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function DeleteConfirm({ onSave, open, setOpen }: DeleteConfirmProps) {
  const seteaOpen = () => {
    setOpen(!open);
  };

  return (
    <div>
      <AlertDialog.Root open={open} onOpenChange={seteaOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="bg-black/50 fixed inset-0" />
          <AlertDialog.Content className="bg-white p-6 rounded shadow-md fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md">
            <AlertDialog.Title className="font-bold text-lg flex flex-col items-center gap-2">
              ¿Guardar cambios?
              <Trash2 className="w-20 h-20 text-red-600" />
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-gray-600">
              Estás a punto de dar de baja un elemento de la lista. ¿Deseas
              continuar?
            </AlertDialog.Description>

            <div className="mt-4 flex justify-between gap-2">
              <AlertDialog.Cancel asChild>
                <button className="px-4 py-2 rounded border bg-gray-400 text-white">
                  Cancelar
                </button>
              </AlertDialog.Cancel>

              <AlertDialog.Action asChild>
                <button
                  // onClick={() => console.log("fila clickeada", id)}
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

export default DeleteConfirm;
