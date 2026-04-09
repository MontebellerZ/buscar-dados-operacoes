import Sqlite from "better-sqlite3";
import path from "path";
import fs from "fs";
import os from "os";
import readSql from "./readSql";

const appDir = path.join(os.homedir(), "AppData", "Roaming", "FretebrasOperacoes");

if (!fs.existsSync(appDir)) {
  fs.mkdirSync(appDir, { recursive: true });
}

const dbPath = path.join(appDir, "database.db");

const db: Sqlite.Database = new Sqlite(dbPath, { verbose: console.log });

const createTables = () => {
  const sql = readSql("schema.sql");
  db.exec(sql);
};

createTables();

export default db;
