import path from "path";
import fs from "fs";
import crypto from "crypto";
import Sqlite from "better-sqlite3";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import gerarCaminhoBanco from "./gerarCaminhoBanco";

const { dbPath, dbUrl } = gerarCaminhoBanco();

function resolveMigrationsDirectory() {
  const candidates = [
    path.resolve(__dirname, "migrations"),
    path.resolve(process.cwd(), "src", "db", "migrations"),
    path.resolve(process.cwd(), "dist", "db", "migrations"),
  ];

  return candidates.find((dir) => fs.existsSync(dir));
}

function applyInternalMigrations(databasePath: string) {
  const migrationsDir = resolveMigrationsDirectory();
  if (!migrationsDir) {
    return;
  }

  const db = new Sqlite(databasePath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS __app_migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      checksum TEXT NOT NULL,
      appliedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort((a, b) => a.localeCompare(b));

  const selectApplied = db.prepare("SELECT checksum FROM __app_migrations WHERE name = ?");
  const registerApplied = db.prepare("INSERT INTO __app_migrations (name, checksum) VALUES (?, ?)");

  for (const file of migrationFiles) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, "utf-8");
    const checksum = crypto.createHash("sha256").update(sql).digest("hex");

    const applied = selectApplied.get(file) as { checksum: string } | undefined;
    if (applied) {
      if (applied.checksum !== checksum) {
        db.close();
        throw new Error(`Migration alterada após aplicação: ${file}. Crie uma nova migration.`);
      }

      continue;
    }

    const tx = db.transaction(() => {
      db.exec(sql);
      registerApplied.run(file, checksum);
    });

    tx();
  }

  db.close();
}

applyInternalMigrations(dbPath);

const adapter = new PrismaBetterSqlite3({ url: dbUrl });

const prisma = new PrismaClient({ adapter });

export default prisma;
