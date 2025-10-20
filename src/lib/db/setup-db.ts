import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

// Configurazione del database
const dbPath = path.join(
  process.cwd().replace("src", ""),
  "database",
  "starter_default.db"
);

// Crea il database se non esiste
function ensureDatabaseExists(): void {
  if (!fs.existsSync(dbPath)) {
    console.log("Creating database directory and file...");
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    const db = new Database(dbPath);
    // Chiudi il database dalle tabelle definite in schema.sql
    const schemaPath = path.join(process.cwd(), "database", "schema.sql");
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, "utf8");
      console.log("Applying schema.sql to database...");
      db.exec(schema);
      db.close();
    }
    console.log("Database created successfully!");
  } else {
    console.log("Database already exists.");
  }
}

// Inizializza il database se non esiste
ensureDatabaseExists();

// Export della funzione factory
export { getDatabaseConnection } from "@/lib/db";
