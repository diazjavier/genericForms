"use client"
import { useState } from "react"
import InputDeMentira from "@/components/mentiras/InputDeMentira"


function Paginita() {
  const [valor, setValor] = useState("Un valor inicial");
  return (
    <div>
      <InputDeMentira valor={valor} setValor={setValor} />
      <p>El valor es: {valor}</p>
    </div>
  )
}

export default Paginita
