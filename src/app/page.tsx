import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <ul>
        <li>
          <Link href="/pages/new/Usuarios">Alta de usuarios</Link>
        </li>
        <li>
          <Link href="/pages/new/MediosDePago">Alta de Medios de Pago</Link>
        </li>
        <li>
          <Link href="/pages/new/TiposDeMovimientosStock">Alta de Tipos de Movimeinto de Stock</Link>
        </li>
        <li>
          <Link href="/pages/update/Usuarios/1">Modificación de usuario 1</Link>
        </li>
        <li>
          <Link href="/pages/update/Usuarios/2">Modificación de usuario 2</Link>
        </li>
        <li>
          <Link href="/pages/update/Usuarios/3">Modificación de usuario 3</Link>
        </li>
                <li>
          <Link href="/pages/dataTablePage/Usuarios">Ejemplo de DataTable</Link>
        </li>
      </ul>
    </div>
  );
}
