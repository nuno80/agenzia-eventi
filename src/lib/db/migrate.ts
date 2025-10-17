import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

// Configurazione del database
const dbPath = path.join(process.cwd(), "database", "starter_default.db");
const schemaPath = path.join(process.cwd(), "database", "schema.sql");

async function runFullSchemaMigration() {
  console.log(
    "[Migrate Script] Running full schema application from database/schema.sql..."
  );

  try {
    // Assicurati che il database esista
    if (!fs.existsSync(dbPath)) {
      console.log("[Migrate Script] Database file does not exist, creating...");
      fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    }

    // Connettiti al database
    const db = new Database(dbPath);

    // Leggi e applica lo schema
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, "utf8");
      console.log("[Migrate Script] Applying schema to database...");
      db.exec(schema);
      
      console.log("[Migrate Script] Schema applied successfully!");
      
      // Verifica le tabelle create
      const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
      console.log("[Migrate Script] Tables created:", tables.map((row: any) => row.name));
      
    } else {
      console.error("[Migrate Script] Schema file not found:", schemaPath);
      process.exit(1);
    }

    db.close();
    console.log("[Migrate Script] Database connection closed.");
    
  } catch (error) {
    console.error(
      "[Migrate Script] Script failed:",
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}

// Esegui la funzione principale
runFullSchemaMigration();
