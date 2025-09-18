"use client"


interface InputDeMentiraProps {
  valor: string;
  setValor: (nuevoValor: string) => void;
}

function InputDeMentira({valor, setValor}: InputDeMentiraProps) {
    
    const cambiaValor = (e:any) => {
        setValor(e.target.value);
    };

    return (
    <div>
      <input type="text" name="elInpu" defaultValue={valor} onChange={cambiaValor}/>
    </div>
  )
}

export default InputDeMentira
