    import { FormValues } from "@/interfaces/forms";
    
    export const formMediosDePagoRegiter: FormValues = {
        formName: "mediosDePagoRegister",
        formTitle: "Alta de Medios de Pago",
        action:"POST",
        table: "MediosDePago",
        fields: [
        {
            fieldType: "input",
            label: "Medio de Pago",
            name: "medioDePago",
            type: "text",
            subType: "text",
            placeholder: "Escriba un medio de pago...",
            autofocus: true,
            required: true,
            value: [""],
            dataType: "varchar",
            campoTabla: "descripcion",
            unique: true,
        },
    ],
        buttons: [
            {
            label: "Cancelar",
            type: "reset",
            color: "gray",
        },{
            label: "Guardar",
            type: "submit",
            color: "grass",
        },
        ]
    };
