# Mock Data Ready for Testing

## ✅ Database popolato con dati di test completamente funzionanti

## 👤 Utenti Disponibili

### Admin Users
- **Email**: `admin@agenzia-eventi.com`
- **Email**: `manager@agenzia-eventi.com`
- **Role**: admin/manager
- **Accesso**: A tutte le funzionalità admin

### Partecipanti  
- **Email**: `marco.rossi@example.com` (Marco Rossi)
- **Email**: `giulia.bianchi@example.com` (Giulia Bianchi) 
- **Email**: `alessandro.verdi@example.com` (Alessandro Verdi)
- **Role**: user

### Relatori
- **Email**: `anna.ferrari@example.com` (Anna Ferrari - AI Expert)
- **Email**: `paolo.gallo@example.com` (Paolo Gallo - Cloud/React Specialist)
- **Role**: user

## 📅 Eventi Disponibili (tutti pubblicati)

### 1. Tech Conference 2024
- **ID**: `1`
- **Tipo**: conference
- **Location**: Centro Congressi Milano
- **Partecipanti Max**: 150
- **Prezzo**: €299.99
- **Partecipanti attuali**: 3 (2 registered, 1 checked_in)
- **Relatori**: 2 (Anna Ferrari, Paolo Gallo)

### 2. Webinar Marketing Digitale  
- **ID**: `2`
- **Tipo**: webinar
- **Location**: Online
- **Partecipanti Max**: 500
- **Prezzo**: €49.99
- **Partecipanti attuali**: 2 (1 registered, 1 checked_in)

### 3. Workshop React Advanced
- **ID**: `3` 
- **Tipo**: workshop
- **Location**: Tech Hub Roma
- **Partecipanti Max**: 25
- **Prezzo**: €149.99
- **Partecipanti attuali**: 1 (registered)
- **Relatori**: 1 (Paolo Gallo - invited)

## 🎯 Test URLs da Testare

### Admin Features
- `/admin` - Dashboard principale
- `/admin/events` - Lista eventi
- `/admin/events/create` - Creazione nuovo evento
- `/admin/events/1` - Dashboard evento Tech Conference
- `/admin/events/1/participants` - Gestione partecipanti evento 1 *(DA TESTARE)*
- `/admin/events/1/program` - Gestione sessioni evento 1

### Public Features  
- `/events/1/register` - Registrazione pubblica evento 1 *(DA TESTARE)*
- `/events/2/register` - Registrazione pubblico evento 2
- `/events/3/register` - Registrazione pubblico evento 3

## 🔐 Credenziali per Test

### Admin Login
1. Vai su `/sign-in`
2. Email: `admin@agenzia-eventi.com`
3. (nessuna password per mock)

### Test Workflow Partecipanti
1. Login come admin (`admin@agenzia-eventi.com`)
2. Vai a `/admin/events/1/participants`
3. Test funzionalità:
   - ✅ Visualizzazione lista partecipanti
   - ✅ Filtri per status (registered, checked_in)
   - ✅ Ricerca partecipanti
   - ✅ Paginazione
   - ✅ Modifica stato partecipante
   - ✅ Invito nuovo partecipante
   - ✅ Importazione CSV
   - ✅ Esportazione CSV

### Test Workflow Registrazione Pubblica
1. Vai a `/events/1/register` (senza login)
2. Compila form registrazione
3. Verifica conferma e validazione
4. Controlla capacità evento

## 📊 Dati Esistenti nel Database

### Statistiche attuali
- **Utenti totali**: 7 (2 admin, 5 regular)
- **Eventi pubblicati**: 3
- **Registrazioni totali**: 6
- **Relatori assegnati**: 3
- **Job importazione completati**: 1

### Stato partecipanti per evento
- **Evento 1 (Tech Conference)**: 3 partecipanti
- **Evento 2 (Webinar)**: 2 partecipanti  
- **Evento 3 (Workshop React)**: 1 partecipante

## 🚀 Procedura di Test

1. **Avvia sviluppo**: `pnpm dev`
2. **Apri browser**: `http://localhost:3000`
3. **Login admin**: usa credenziali sopra
4. **Testa funzionalità**: segui URLs elencati
5. **Testa registrazione pubblica**: logout e accedi a pagine public

## 📋 Features FEAT-003 Implementate da Testare

✅ **Gestione Partecipanti Admin**
- Tabella con filtri, ricerca, paginazione
- Modifica stato partecipanti
- Inviti manuali
- Import/Export CSV con job tracking

✅ **Registrazione Pubblica**  
- Form responsive con validazione
- Gestione capacità evento
- Compatibility con/esistente guest users

✅ **Gestione Relatori**
- Assegnazione speaker a eventi
- Stati: invited/confirmed/declined
- Bio e dati anagrafici

## 🔧 Note Tecniche

- Il database usa status `registered/checked_in` vs `REGISTERED/CHECKED_IN` - l'app dovrebbe gestire entrambi i formati
- Tabelle create: `event_speaker`, `backup_jobs`
- Schema compatibile con server actions esistenti
- Dati realistici per test completi dell'applicazione

---

**PRONTO PER TESTING LIVE! 🎉**
