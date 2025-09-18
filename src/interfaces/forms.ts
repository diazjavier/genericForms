
type ButtonColor = undefined | "gray" | "gold" | "gray" | "gold" | "bronze" | "brown" | "yellow" | "amber" | "orange" | "tomato" | "red" | "ruby" | "crimson" | "pink" | "plum" | "purple" | "violet" | "iris" | "indigo" | "blue" | "cyan" | "teal" | "jade" | "green" | "grass" | "lime" | "mint" | "sky";
type FieldType = undefined | "input" | "select" | "textarea" | "checkbox" | "radio" | "datepicker";
type TextType = undefined | "text" | "email" | "password" | "number";
type TextSubType = undefined | "text" | "user" | "email" | "password";
type ButtonType = undefined | "button" | "submit" | "reset";
type FormActions = "GET" | "PUT" | "POST" | "DELETE";
type DataType = "integer" | "float" | "varchar" | "date" | "datetime" | "boolean" | "text";


export interface FormValues {
  formName: string;
  formTitle: string;
  fields: Field[];
  buttons: FormButton[];
  table?: string;
  id?: number;
  action?: FormActions;
};

export interface Field {
  fieldType: FieldType; 
  label: string;
  name: string;
  type?: TextType;
  subType?: TextSubType; 
  placeholder?: string;
  autofocus?: boolean;
  //icon?: string;
  options?: Options[]; // For select fields
  required?: boolean;
  //defaultValue?: string[] | undefined;
  value?: string[] | undefined;
  campoTabla?: string;
  dataType: DataType;
};

export interface FormButton {  
  label: string;
  type: ButtonType;
  style?: string;
  color?: ButtonColor; //Estos no van: "primary" | "secondary" | "tertiary" | "success" | "warning" | "error" | "ghost" | "link";
};

export interface Options {
  label: string;
  value: string;
};

export interface FormData2 {
  campo: string;
  valor: string[] | undefined;
}

export interface FormInputProps {
  field: Field;
  //datos: FormData2[];
  dataChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, value?: string[]) => void;
  //setDatos: React.Dispatch<React.SetStateAction<FormData2[]>>;
}

//export type FormData = {[x: string]: string | undefined};
