import { Pool } from "pg";

const conn = new Pool({

    user: process.env.NEXT_PUBLIC_DB_USER,
    password: process.env.NEXT_PUBLIC_DB_PASS,
    host: process.env.NEXT_PUBLIC_DB_HOST,
    port: Number(process.env.NEXT_PUBLIC_DB_PORT),
    database: process.env.NEXT_PUBLIC_DB_DATABASE,

  });

export {conn};