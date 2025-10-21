-- database/schema.sql

-- Schema per Event Manager App
-- Segue le specifiche definite in AGENTS.MD

-- Tabella utenti (gestita da Clerk ma manteniamo per relazioni)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, -- Clerk user ID
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabella eventi
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT, -- Tipo di evento
  location TEXT,
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  max_participants INTEGER,
  price DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'in_progress', 'completed', 'cancelled', 'postponed')),
  is_public BOOLEAN DEFAULT FALSE, -- Indica se l'evento è visibile pubblicamente
  slug TEXT, -- URL-friendly identifier per accesso pubblico
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabella partecipanti agli eventi
CREATE TABLE IF NOT EXISTS participants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL,
  user_id TEXT NOT NULL, -- FK to users.id (Clerk ID)
  registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'checked_in', 'cancelled', 'waitlisted', 'checked_out', 'absent')),
  notes TEXT,
  qr_token TEXT, -- Token unico per QR code check-in
  check_in_time DATETIME, -- Timestamp del check-in
  check_out_time DATETIME, -- Timestamp del check-out
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(event_id, user_id) -- Un utente non può registrarsi allo stesso evento più volte
);

-- Tabella per analytics snapshots
CREATE TABLE IF NOT EXISTS analytics_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  snapshot_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  total_users INTEGER DEFAULT 0,
  total_events INTEGER DEFAULT 0,
  total_participants INTEGER DEFAULT 0,
  active_events INTEGER DEFAULT 0,
  monthly_revenue DECIMAL(10,2) DEFAULT 0
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_participants_event_id ON participants(event_id);
CREATE INDEX IF NOT EXISTS idx_participants_user_id ON participants(user_id);
CREATE INDEX IF NOT EXISTS idx_participants_status ON participants(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics_snapshots(snapshot_date);

-- Trigger per aggiornare updated_at
CREATE TRIGGER IF NOT EXISTS update_users_updated_at 
  AFTER UPDATE ON users
BEGIN
  UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_events_updated_at 
  AFTER UPDATE ON events
BEGIN
  UPDATE events SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Tabella sessioni di eventi
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  room TEXT,
  speaker_id TEXT, -- FK to users.id (Clerk ID)
  event_id INTEGER NOT NULL, -- FK to events.id
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (speaker_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Tabella di collegamento eventi-admin (multi-admin support)
CREATE TABLE IF NOT EXISTS event_admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL,
  user_id TEXT NOT NULL, -- FK to users.id (Clerk ID)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(event_id, user_id)
);

-- Tabella budget eventi
CREATE TABLE IF NOT EXISTS event_budgets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('venue', 'catering', 'equipment', 'staff', 'marketing', 'other')),
  description TEXT,
  budgeted_amount DECIMAL(10,2) NOT NULL,
  actual_amount DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'committed', 'paid', 'cancelled')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Tabella comunicazioni eventi
CREATE TABLE IF NOT EXISTS event_announcements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  target_audience TEXT DEFAULT 'all' CHECK (target_audience IN ('all', 'participants', 'speakers', 'sponsors')),
  is_email_sent BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Tabella rimborsi viaggi relatori
CREATE TABLE IF NOT EXISTS travel_reimbursements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  speaker_id TEXT NOT NULL, -- FK to users.id (Clerk ID)
  event_id INTEGER NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'approved', 'rejected', 'paid', 'cancelled')),
  receipt_url TEXT, -- URL del file ricevuta
  admin_notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (speaker_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Aggiorno indici per le nuove tabelle
CREATE INDEX IF NOT EXISTS idx_sessions_event_id ON sessions(event_id);
CREATE INDEX IF NOT EXISTS idx_sessions_speaker_id ON sessions(speaker_id);
CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_sessions_end_time ON sessions(end_time);
CREATE INDEX IF NOT EXISTS idx_event_admins_event_id ON event_admins(event_id);
CREATE INDEX IF NOT EXISTS idx_event_admins_user_id ON event_admins(user_id);
CREATE INDEX IF NOT EXISTS idx_event_budgets_event_id ON event_budgets(event_id);
CREATE INDEX IF NOT EXISTS idx_event_announcements_event_id ON event_announcements(event_id);
CREATE INDEX IF NOT EXISTS idx_travel_reimbursements_speaker_id ON travel_reimbursements(speaker_id);
CREATE INDEX IF NOT EXISTS idx_travel_reimbursements_event_id ON travel_reimbursements(event_id);

-- Trigger per aggiornare updated_at per sessions
CREATE TRIGGER IF NOT EXISTS update_sessions_updated_at 
  AFTER UPDATE ON sessions
BEGIN
  UPDATE sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
