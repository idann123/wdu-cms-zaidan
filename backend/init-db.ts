import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_DB = 'postgres';
const TARGET_DB = 'wdu_cms_db';

function parseDatabaseUrl(url: string) {
  const pattern = /postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
  const match = url.match(pattern);
  if (!match) return null;
  return {
    user: match[1],
    password: decodeURIComponent(match[2]),
    host: match[3],
    port: parseInt(match[4], 10),
    database: match[5],
  };
}

async function initDatabase() {
  const dbUrl = process.env.DATABASE_URL || '';
  const parsed = parseDatabaseUrl(dbUrl);

  const client = new Client({
    host: parsed?.host || 'localhost',
    port: parsed?.port || 5432,
    user: parsed?.user || 'postgres',
    password: parsed?.password || '123456',
    database: DEFAULT_DB,
  });

  try {
    await client.connect();
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [TARGET_DB]
    );

    if (result.rows.length === 0) {
      console.log(`Creating database "${TARGET_DB}"...`);
      await client.query(`CREATE DATABASE ${TARGET_DB}`);
      console.log(`Database "${TARGET_DB}" created successfully!`);
    } else {
      console.log(`Database "${TARGET_DB}" already exists.`);
    }
  } catch (error: any) {
    if (error.code === '42P04') {
      console.log(`Database "${TARGET_DB}" already exists.`);
    } else {
      console.error('Error creating database:', error.message);
      process.exit(1);
    }
  } finally {
    await client.end();
  }
}

initDatabase();