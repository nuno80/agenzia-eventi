import { test, expect } from "@playwright/test";

test.describe("Event Creation Flow - E2E Tests", () => {
  // Setup - login con admin user prima di ogni test
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    
    // Simula login con Clerk (in ambiente reale usare le credenziali di test)
    await page.fill('input[name="email"]', "admin@test.com");
    await page.fill('input[name="password"]', "testpassword123");
    await page.click('button[type="submit"]');
    
    // Attendi redirect alla dashboard admin
    await page.waitForURL(/\/admin/);
    await expect(page.locator("h1")).toContainText("Dashboard Admin");
  });

  test("should create a complete event through the wizard", async ({ page }) => {
    // Naviga alla pagina creazione eventi
    await page.goto("/admin/events/new");
    
    await expect(page.locator("h1")).toContainText("Crea un Nuovo Evento");
    
    // Step 1: Informazioni Base
    await expect(page.locator("text=Step 1 di 3")).toBeVisible();
    
    await page.fill('input[name="title"]', "Conference E2E Test 2024");
    await page.selectOption('select[name="eventType"]', "conference");
    await page.fill('textarea[name="description"]', "A comprehensive conference created via E2E test");
    
    // Controlla validazione titolo troppo corto
    await page.click('button:has-text("Continua")');
    await expect(page.locator("text=Step 1 di 3")).toBeVisible(); // Non dovrebbe procedere
    
    await page.fill('input[name="title"]', "Valid Conference Title");
    await page.click('button:has-text("Continua")');
    
    // Step 2: Quando e Dove
    await expect(page.locator("text=Step 2 di 3")).toBeVisible();
    
    await page.fill('input[name="location"]', "Test Conference Center");
    
    // Selettore date (potrebbe richiedere interazione UI specifica)
    await page.fill('input[name="startDate"]', "2024-12-15");
    await page.fill('input[name="endDate"]', "2024-12-17");
    
    await page.click('button:has-text("Continua")');
    
    // Step 3: Dettagli Finali
    await expect(page.locator("text=Step 3 di 3")).toBeVisible();
    
    await page.fill('input[name="maxParticipants"]', "150");
    await page.fill('input[name="price"]', "299.99");
    
    // Completa creazione
    await page.click('button:has-text("Crea Evento e Vai alla Dashboard")');
    
    // Verifica redirect alla dashboard evento
    await page.waitForURL(/\/admin\/events\/\d+/);
    await expect(page.locator("h1")).toContainText("Conference E2E Test 2024");
    
    // Verifica presenza card statistiche
    await expect(page.locator("text=PROGRAMMA")).toBeVisible();
    await expect(page.locator("text=PARTECIPANTI")).toBeVisible();
    await expect(page.locator("text=BUDGET")).toBeVisible();
  });

  test("should validate form fields correctly", async ({ page }) => {
    await page.goto("/admin/events/new");
    
    // Test validazione campi richiesti
    await page.click('button:has-text("Continua")');
    
    await expect(page.locator("text=Il titolo deve contenere almeno 3 caratteri")).toBeVisible();
    
    // Test date range invalido
    await page.fill('input[name="title"]', "Test Event");
    await page.fill('input[name="location"]', "Test Location");
    await page.click('button:has-text("Continua")');
    
    // Naviga allo step 2 e inserisci date non valide
    await page.fill('input[name="startDate"]', "2024-12-17");
    await page.fill('input[name="endDate"]', "2024-12-15"); // Fine prima dell'inizio
    await page.fill('input[name="maxParticipants"]', "150");
    await page.click('button:has-text("Continua")');
    
    await expect(page.locator("text=La data di fine deve essere successiva alla data di inizio")).toBeVisible();
  });

  test("should handle input validation and edge cases", async ({ page }) => {
    await page.goto("/admin/events/new");
    
    // Test caratteri speciali nel titolo
    await page.fill('input[name="title"]', "Event with émojis 🎉 and spëcia! ch@r$");
    await page.selectOption('select[name="eventType"]', "workshop");
    await page.fill('textarea[name="description"]', "Description with special chars: àèìòù @#$%");
    await page.click('button:has-text("Continua")');
    
    // Dovrebbe passare allo step 2
    await expect(page.locator("text=Step 2 di 3")).toBeVisible();
    
    // Test limiti numerici
    await page.fill('input[name="maxParticipants"]', "0"); // Non positivo
    await page.fill('input[name="price"]', "-50"); // Negativo
    await page.click('button:has-text("Crea Evento e Vai alla Dashboard")');
    
    await expect(page.locator("text=deve essere un numero positivo")).toBeVisible();
    await expect(page.locator("text=deve essere un numero non negativo")).toBeVisible();
  });
});

test.describe("Event Dashboard Management - E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Login come admin
    await page.goto("/login");
    await page.fill('input[name="email"]', "admin@test.com");
    await page.fill('input[name="password"]', "testpassword123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin/);
  });

  test("should display dashboard cards with correct data", async ({ page }) => {
    // Create un evento di test se necessario
    await page.goto("/admin/events/new");
    await page.fill('input[name="title"]', "Dashboard Test Event");
    await page.selectOption('select[name="eventType"]', "conference");
    await page.fill('textarea[name="description"]', "Test for dashboard");
    await page.fill('input[name="location"]', "Test Location");
    await page.fill('input[name="startDate"]', "2024-12-15");
    await page.fill('input[name="endDate"]', "2024-12-17");
    await page.fill('input[name="maxParticipants"]', "100");
    await page.click('button:has-text("Continua")');
    await page.click('button:has-text("Continua")');
    await page.click('button:has-text("Crea Evento e Vai alla Dashboard")');
    
    await page.waitForURL(/\/admin\/events\/\d+/);
    
    // Verifica dashboard cards
    await expect(page.locator('[data-testid="card-program"]')).toBeVisible();
    await expect(page.locator('[data-testid="card-participants"]')).toBeVisible();
    await expect(page.locator('[data-testid="card-speakers"]')).toBeVisible();
    await expect(page.locator('[data-testid="card-budget"]')).toBeVisible();
    
    // Verifica valori iniziali
    await expect(page.locator('[data-testid="program-sessions"]')).toContainText("0 sessioni");
    await expect(page.locator('[data-testid="participants-total"]')).toContainText("0 / 100");
  });

  test("should navigate to program management", async ({ page }) => {
    // Naviga alla gestione programma
    await page.goto("/admin/events");
    
    // Seleziona primo evento disponibile
    await page.click('text=Gestisci');
    
    await expect(page.locator("h1")).toContainText("Dashboard");
    
    // Click su gestione programma
    await page.click('text=→ Gestisci Programma');
    
    await page.waitForURL(/\/program$/);
    await expect(page.locator("h1")).toContainText("Gestione Programma");
    await expect(page.locator("text=Aggiungi Sessione")).toBeVisible();
  });
});

test.describe("Session Management Flow - E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "admin@test.com");
    await page.fill('input[name="password"]', "testpassword123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin/);
    
    // Naviga a un evento esistente
    await page.goto("/admin/events");
    const eventCards = page.locator('[data-testid="event-card"]');
    if (await eventCards.count() > 0) {
      await eventCards.first().click('text=Gestisci');
    } else {
      // Crea evento se non ce ne sono
      await page.goto("/admin/events/new");
      await page.fill('input[name="title"]', "Session Test Event");
      await page.selectOption('select[name="eventType"]', "workshop");
      await page.fill('input[name="location"]', "Test Venue");
      await page.fill('input[name="startDate"]', "2024-12-15");
      await page.fill('input[name="endDate"]', "2024-12-15");
      await page.fill('input[name="maxParticipants"]', "50");
      await page.click('button:has-text("Continua")');
      await page.click('button:has-text("Continua")');
      await page.click('button:has-text("Crea Evento e Vai alla Dashboard")');
    }
  });

  test("should create a new session successfully", async ({ page }) => {
    // Naviga alla gestione programma
    await page.click('text=Gestisci Programma');
    
    await expect(page.locator("text=Aggiungi Sessione")).toBeVisible();
    
    // Click per aprire modale creazione sessione
    await page.click('text=Aggiungi Sessione');
    
    // Attendi apertura modale
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator("h2")).toContainText("Crea una Nuova Sessione");
    
    // Compila form sessione
    await page.fill('input[name="title"]', "Introduction to Testing");
    await page.fill('textarea[name="description"]', "A comprehensive introduction to software testing practices");
    
    // Setup orari
    await page.fill('input[name="startTime"]', "09:00");
    await page.fill('input[name="endTime"]', "10:30");
    
    // Seleziona sala
    await page.fill('input[name="room"]', "Conference Room A");
    
    // Salva sessione
    await page.click('button:has-text("Salva Sessione")');
    
    // Verifica chiusura modale e refresh tabella
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    
    // Verifica sessione creata nella lista
    await expect(page.locator('text=Introduction to Testing')).toBeVisible();
    await expect(page.locator('text=Conference Room A')).toBeVisible();
  });

  test("should enforce session time validation", async ({ page }) => {
    await page.goto("/admin/events");
    await page.click('text=Gestisci');
    await page.click('text=Gestisci Programma');
    
    await page.click('text=Aggiungi Sessione');
    
    // Inserisci orari non validi (fine prima dell'inizio)
    await page.fill('input[name="title"]', "Invalid Time Session");
    await page.fill('input[name="startTime"]', "14:00");
    await page.fill('input[name="endTime"]', "13:00"); // Fine prima dell'inizio
    await page.fill('input[name="room"]', "Room A");
    
    await page.click('button:has-text("Salva Sessione")');
    
    // Dovrebbe mostrare errore validazione
    await expect(page.locator("text=L'orario di fine deve essere successivo all'orario di inizio")).toBeVisible();
    await expect(page.locator('[role="dialog"]')).toBeVisible(); // Modale ancora aperto
  });

  test("should handle speaker conflict detection", async ({ page }) => {
    await page.goto("/admin/events");
    await page.click('text=Gestisci');
    await page.click('text=Gestisci Programma');
    
    // Crea prima sessione
    await page.click('text=Aggiungi Sessione');
    await page.fill('input[name="title"]', "Morning Session");
    await page.fill('input[name="startTime"]', "09:00");
    await page.fill('input[name="endTime"]', "10:30");
    await page.fill('input[name="room"]', "Room A");
    await page.selectOption('select[name="speakerId"]', "speaker-1");
    await page.click('button:has-text("Salva Sessione")');
    
    // Crea seconda sessione con conflitto
    await page.click('text=Aggiungi Sessione');
    await page.fill('input[name="title"]', "Conflicting Session");
    await page.fill('input[name="startTime"]', "10:00"); // Overlaps 09:00-10:30
    await page.fill('input[name="endTime"]', "11:30");
    await page.fill('input[name="room"]', "Room B");
    await page.selectOption('select[name="speakerId"]', "speaker-1"); // Stesso speaker
    await page.click('button:has-text("Salva Sessione")');
    
    // Dovrebbe mostrare errore conflitto
    await expect(page.locator("text=Conflitto di programmazione: il relatore è già occupato in questo orario")).toBeVisible();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });

  test("should edit existing session", async ({ page }) => {
    await page.goto("/admin/events");
    await page.click('text=Gestisci');
    await page.click('text=Gestisci Programma');
    
    // Se ci sono sessioni, modifica la prima
    const sessionRows = page.locator('table tr');
    if (await sessionRows.count() > 1) { // Header + almeno una riga
      await sessionRows.nth(1).click('text=Modifica');
      
      // Modifica titolo
      await page.fill('input[name="title"]', "Updated Session Title");
      await page.click('button:has-text("Salva Modifiche")');
      
      // Verifica aggiornamento
      await expect(page.locator('text=Updated Session Title')).toBeVisible();
    }
  });

  test("should delete session with confirmation", async ({ page }) => {
    await page.goto("/admin/events");
    await page.click('text=Gestisci');
    await page.click('text=Gestisci Programma');
    
    const sessionRows = page.locator('table tr');
    const initialCount = await sessionRows.count();
    
    if (initialCount > 1) {
      // Trova bottone eliminazione e clicca
      await sessionRows.nth(1).click('text=Elimina');
      
      // Conferma eliminazione nella modale
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      await expect(page.locator("text=Sei sicuro di voler eliminare questa sessione?")).toBeVisible();
      
      await page.click('button:has-text("Elimina")');
      
      // Verifica che la sessione sia stata rimossa
      await expect(page.locator('[role="dialog"]')).not.toBeVisible();
      
      const finalCount = await sessionRows.count();
      expect(finalCount).toBe(initialCount - 1);
    }
  });
});

test.describe("Event List and Search - E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "admin@test.com");
    await page.fill('input[name="password"]', "testpassword123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin/);
  });

  test("should display events list with filtering", async ({ page }) => {
    await page.goto("/admin/events");
    
    await expect(page.locator("h1")).toContainText("I Tuoi Eventi");
    
    // Test ricerca
    const searchInput = page.locator('input[placeholder*="Cerca"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill("Test");
      await page.waitForTimeout(500); // Attendi debounce
      
      // Verifica filtraggio risultati
      const events = page.locator('[data-testid="event-card"]');
      const eventTitles = await events.allTextContents();
      expect(eventTitles.every(title => title.includes("Test"))).toBe(true);
    }
    
    // Test filtro per tipo
    const eventTypeFilter = page.locator('select[name="eventType"]');
    if (await eventTypeFilter.isVisible()) {
      await eventTypeFilter.selectOption("conference");
      await page.waitForTimeout(500);
      
      // Verifica che solo eventi conference siano mostrati
      const conferenceEvents = page.locator('[data-testid="event-card"]');
      const firstEventCard = conferenceEvents.first();
      const eventDetails = await firstEventCard.locator('[data-testid="event-type"]').textContent();
      expect(eventDetails).toBe("conference");
    }
  });

  test("should handle pagination correctly", async ({ page }) => {
    await page.goto("/admin/events");
    
    // Verifica paginator se ci sono molti eventi
    const pagination = page.locator('[data-testid="pagination"]');
    if (await pagination.isVisible()) {
      // Controlla elementi paginazione
      await expect(pagination.locator('button[data-testid="prev-page"]')).toBeVisible();
      await expect(pagination.locator('button[data-testid="next-page"]')).toBeVisible();
      await expect(pagination.locator('span[data-testid="page-info"]')).toBeVisible();
      
      // Test navigazione pagina successiva se disponibile
      const nextPageBtn = pagination.locator('button[data-testid="next-page"]:not([disabled])');
      if (await nextPageBtn.isVisible()) {
        const firstPageText = await page.locator('[data-testid="event-card"]').first().textContent();
        await nextPageBtn.click();
        
        // Verifica che la pagina sia cambiata e mostri risultati diversi
        await expect(page.locator('span[data-testid="current-page"]').not.toHaveText("1"));
      }
    }
  });

  test("should handle empty state gracefully", async ({ page }) => {
    // Simula stato vuoto (potrebbe richiedere cancellazione eventi o navigazione specifica)
    await page.goto("/admin/events");
    
    const emptyState = page.locator('[data-testid="empty-state"]');
    if (await emptyState.isVisible()) {
      await expect(emptyState.locator('text=Nessun evento ancora creato')).toBeVisible();
      await expect(emptyState.locator('text=Clicca su "Crea Nuovo Evento"')).toBeVisible();
      await expect(emptyState.locator('button:has-text("Crea Nuovo Evento")')).toBeVisible();
    }
  });
});

test.describe("Error Handling and Edge Cases - E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "admin@test.com");
    await page.fill('input[name="password"]', "testpassword123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin/);
  });

  test("should handle network errors gracefully", async ({ page }) => {
    // Simula errore di rete disabilitando temporaneamente le richieste
    await page.route("**/api/events/**", route => route.abort());
    
    await page.goto("/admin/events");
    
    // Dovrebbe mostrare stato di errore
    await expect(page.locator('[data-testid="error-state"]')).toBeVisible();
    await expect(page.locator("text=Impossibile caricare gli eventi")).toBeVisible();
    await expect(page.locator('button:has-text("Riprova")')).toBeVisible();
    
    // Test pulsante retry
    await page.unroute("**/api/events/**");
    await page.click('button:has-text("Riprova")');
    
    await expect(page.locator('[data-testid="error-state"]')).not.toBeVisible();
  });

  test("should handle unauthorized access attempts", async ({ page }) => {
    // Prova accesso diretto a rotte protette senza login
    await page.goto("/admin/events");
    await expect(page.locator("text=Accesso negato")).toBeVisible();
    
    await page.goto("/admin/events/99999");
    await expect(page.locator("text=Accesso negato")).toBeVisible();
    
    await page.goto("/admin/events/99999/program");
    await expect(page.locator("text=Accesso negato")).toBeVisible();
  });

  test("should handle invalid URLs and 404 errors", async ({ page }) => {
    await page.goto("/admin");
    await page.goto("/admin/non-existent-page");
    
    await expect(page.locator("h1")).toContainText("Pagina non trovata");
    await expect(page.locator("text=Torna alla dashboard")).toBeVisible();
  });

  test("should handle session timeout and re-authentication", async ({ page }) => {
    // Simula session scaduta modificando auth state
    await page.evaluate(() => {
      localStorage.removeItem("clerk-session");
    });
    
    await page.goto("/admin/events");
    
    // Dovrebbe redirect a login
    await page.waitForURL("/login");
    await expect(page.locator("form")).toBeVisible();
  });
});
