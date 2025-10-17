import Database from "better-sqlite3";
import path from "path";

// Define DatabaseConnectionError locally
class DatabaseConnectionError extends Error {
  constructor(message: string, originalError?: Error) {
    super(message);
    this.name = "DatabaseConnectionError";
    if (originalError) {
      this.cause = originalError;
    }
  }
}



// Configurazione del database
const dbPath = path.join(
  process.cwd().replace("src", ""),
  "database",
  "starter_default.db"
);
const maxConnections = 20;

// Connection singleton per development
let db: Database.Connection | null;

// Factory per ottenere la connessione dal database
export function getDbConnection(): Database.Connection {
  if (!db) {
    db = createDbConnection();
  }
  return db;
}

// Creazione della connessione al database
function createDbConnection(): Database.Connection {
  try {
    const db = new Database(dbPath);

    // Abilita WAL per performance e concorrenza
    db.pragma('journal_mode = WAL');
    db.pragma('synchronous = OFF');

    // Configura limite connessioni per evitare errori di too_many connections
    db.maxConnections = maxConnections;

    return db;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw new DatabaseConnectionError(
      "Impossibile connettersi al database:",
      error.message
    );
  }
}

// Funzione per chiudere la connessione (per test/teardown)
export function closeDbConnection(): void {
  if (db) {
    db.close();
    db = null;
  }
}

// Database driver class
class DatabaseDriver {
  private database: Database.Database;

  constructor() {
    this.database = createDbConnection();
  }

  // Esegui query che ritorna risultati
  query(sql: string, params?: any[]): any[] {
    try {
      const stmt = this.database.prepare(sql);
      const result = params ? stmt.all(...params) : stmt.all();
      return result;
    } catch (error) {
      console.error("❌ Query failed:", { sql, params, error });
      throw new Error(`Database query failed: ${error.message}`);
    }
  }

  // Esegui comando che non ritorna risultati (INSERT, UPDATE, DELETE)
  execute(sql: string, params?: any[]): Database.RunResult {
    try {
      const stmt = this.database.prepare(sql);
      const result = params ? stmt.run(...params) : stmt.run();
      return result;
    } catch (error) {
      console.error("❌ Execute failed:", { sql, params, error });
      throw new Error(`Database execute failed: ${error.message}`);
    }
  }

  // Transazione
  transaction<T>(fn: () => T): T {
    const transaction = this.database.transaction(fn);
    return transaction();
  }

  // Chiudi connessione
  close(): void {
    this.database.close();
  }
}

// Singleton instance - persiste tra restart server
let dbInstance: DatabaseDriver | null = null;

export function getDbInstance(): DatabaseDriver {
  if (!dbInstance) {
    dbInstance = new DatabaseDriver();
  }
  return dbInstance;
}



// Utility per il debugging SQL
export function logQuery(sql: string): void {
  console.log("🔍 SQL:", sql);
}

export function query(sql: string, params?: any[]): any[] {
  return getDbInstance().query(sql, params);
}

export function execute(sql: string, params?: any[]): Database.RunResult {
  return getDbInstance().execute(sql, params);
}

export function transaction<T>(fn: () => T): T {
  return getDbInstance().transaction(fn);
}

export default getDbInstance;

export const databaseDriver = getDbInstance; // Esplicito per evitare conflitti
