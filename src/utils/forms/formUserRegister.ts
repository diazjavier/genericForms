    import { FormValues } from "@/interfaces/forms";
    
    export const formUserRegiter: FormValues = {
        formName: "userRegister",
        formTitle: "Alta de usuarios",
        action:"POST",
        table: "Usuarios",
        fields: [
        {
            fieldType: "input",
            label: "Nombre de usuario",
            name: "username",
            type: "text",
            subType: "user",
            placeholder: "Escriba su nombre de usuario...",
            autofocus: true,
            required: true,
            value: [""],
            dataType: "varchar",
            campoTabla: "usuario",
            unique: true,
        },
        {
            fieldType: "input",
            label: "Password",
            name: "password",
            type: "password",
            subType: "password",
            placeholder: "***...",
            autofocus: false,
            required: true,
            dataType: "varchar",
            campoTabla: "password",
        }, {
            fieldType: "input",
            label: "Mail",
            name: "mail",
            type: "email",
            subType: "email",
            placeholder: "yourname@yourprovider.com...",
            autofocus: false,
            required: false,
            dataType: "varchar",
            campoTabla: "email",
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
