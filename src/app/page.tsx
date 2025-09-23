import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <Link href="/pages/userRegister">Alta de usuarios</Link>
      <Link href="/pages/userRegister">Modificación de usuario 1</Link>
      <Link href="/pages/userRegister">Modificación de usuario 2</Link>
      <Link href="/pages/userRegister">Modificación de usuario 3</Link>
    </div>
  );
}
