import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

dotenv.config({
    path: './.env',
    debug: true,
})

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const sql = neon(
    `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require&channel_binding=require`
);

export async function getPgVersion() {
    const result = await sql`SELECT version()`;
    console.log("postgres connected", result[0]);
}
