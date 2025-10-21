// src/lib/db/seed.ts
import { getDbInstance } from "@/lib/db";

// Mock data generation for Event Manager App

const mockUsers = [
  // Admin users
  {
    id: 'user_1_admin',
    email: 'admin@agenzia-eventi.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  },
  {
    id: 'user_2_manager',
    email: 'manager@agenzia-eventi.com', 
    firstName: 'Manager',
    lastName: 'User',
    role: 'manager'
  },
  // Regular users
  {
    id: 'user_3_participant1',
    email: 'marco.rossi@example.com',
    firstName: 'Marco',
    lastName: 'Rossi',
    role: 'user'
  },
  {
    id: 'user_4_participant2',
    email: 'giulia.bianchi@example.com',
    firstName: 'Giulia',
    lastName: 'Bianchi',
    role: 'user'
  },
  {
    id: 'user_5_participant3',
    email: 'alessandro.verdi@example.com',
    firstName: 'Alessandro',
    lastName: 'Verdi',
    role: 'user'
  },
  {
    id: 'user_6_speaker1',
    email: 'anna.ferrari@example.com',
    firstName: 'Anna',
    lastName: 'Ferrari',
    role: 'user'
  },
  {
    id: 'user_7_speaker2',
    email: 'paolo.gallo@example.com',
    firstName: 'Paolo',
    lastName: 'Gallo',
    role: 'user'
  },
  {
    id: 'user_8_participant4',
    email: 'sara.martini@example.com',
    firstName: 'Sara',
    lastName: 'Martini',
    role: 'user'
  },
  {
    id: 'user_9_participant5',
    email: 'lorenzo.conti@example.com',
    firstName: 'Lorenzo',
    lastName: 'Conti',
    role: 'user'
  },
  {
    id: 'user_10_participant6',
    email: 'chiara.romano@example.com',
    firstName: 'Chiara',
    lastName: 'Romano',
    role: 'user'
  }
];

const mockEvents = [
  {
    title: 'Tech Conference 2024',
    description: 'La conferenza annuale sulle ultime innovazioni tecnologiche. Sessioni su AI, cloud computing, cybersecurity e sviluppo software.',
    eventType: 'conference',
    location: 'Centro Congressi Milano, Via Gattamelata, Milano',
    startDate: new Date('2024-12-15T09:00:00Z'),
    endDate: new Date('2024-12-15T18:00:00Z'),
    maxParticipants: 150,
    price: 299.99,
    status: 'published'
  },
  {
    title: 'Webinar Marketing Digitale',
    description: 'Strategie avanzate di digital marketing per il 2025. SEO, social media marketing e content strategy.',
    eventType: 'webinar',
    location: 'Online',
    startDate: new Date('2024-11-28T15:00:00Z'),
    endDate: new Date('2024-11-28T17:00:00Z'),
    maxParticipants: 500,
    price: 49.99,
    status: 'published'
  },
  {
    title: 'Workshop React Advanced',
    description: 'Workshop intensivo su React Hooks, performance optimization e best practices per applicazioni enterprise.',
    eventType: 'workshop',
    location: 'Tech Hub Roma, Via Tiburtina',
    startDate: new Date('2024-12-20T10:00:00Z'),
    endDate: new Date('2024-12-20T14:00:00Z'),
    maxParticipants: 25,
    price: 149.99,
    status: 'published'
  },
  {
    title: 'Seminario Finanza Aziendale',
    description: 'Analisi finanziaria, budget planning e strategie di crescita per PMI italiane.',
    eventType: 'seminar',
    location: 'Camera di Commercio Torino',
    startDate: new Date('2025-01-10T09:30:00Z'),
    endDate: new Date('2025-01-10T13:00:00Z'),
    maxParticipants: 80,
    price: 0,
    status: 'draft'
  },
  {
    title: 'Training Team Leadership',
    description: 'Sviluppo competenze di leadership e gestione team per responsabili di dipartimento.',
    eventType: 'training',
    location: 'Business Center Bologna',
    startDate: new Date('2025-02-05T09:00:00Z'),
    endDate: new Date('2025-02-05T17:00:00Z'),
    maxParticipants: 40,
    price: 199.99,
    status: 'draft'
  }
];

const mockSessions = [
  {
    title: 'Introduzione all\'Intelligenza Artificiale',
    description: 'Panoramica delle tecnologie AI e loro applicazioni business',
    startTime: new Date('2024-12-15T09:00:00Z'),
    endTime: new Date('2024-12-15T10:30:00Z'),
    room: 'Sala A',
    speakerId: 'user_6_speaker1',
    eventId: 1
  },
  {
    title: 'Cloud Computing Strategies',
    description: 'Strategie di migrazione e gestione risorse cloud',
    startTime: new Date('2024-12-15T10:45:00Z'),
    endTime: new Date('2024-12-15T12:15:00Z'),
    room: 'Sala B',
    speakerId: 'user_7_speaker2',
    eventId: 1
  },
  {
    title: 'Cybersecurity Best Practices',
    description: 'Protezione dati e prevenzione attacchi informatici',
    startTime: new Date('2024-12-15T13:30:00Z'),
    endTime: new Date('2024-12-15T15:00:00Z'),
    room: 'Sala A',
    speakerId: 'user_6_speaker1',
    eventId: 1
  },
  {
    title: 'React Performance Optimization',
    description: 'Tecniche avanzate per ottimizzare performance app React',
    startTime: new Date('2024-12-20T10:00:00Z'),
    endTime: new Date('2024-12-20T12:00:00Z'),
    room: 'Workshop Room',
    speakerId: 'user_7_speaker2',
    eventId: 3
  },
  {
    title: 'React Hooks in Depth',
    description: 'Utilizzo avanzato di Hooks e custom patterns',
    startTime: new Date('2024-12-20T12:15:00Z'),
    endTime: new Date('2024-12-20T14:00:00Z'),
    room: 'Workshop Room',
    speakerId: 'user_7_speaker2',
    eventId: 3
  }
];

async function seedUsers() {
  console.log('📝 Seeding users...');
  
  const db = getDbInstance();
  
  for (const user of mockUsers) {
    try {
      db.query(`
        INSERT OR IGNORE INTO users (
          id, email, first_name, last_name, role, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [user.id, user.email, user.firstName, user.lastName, user.role]);
    } catch (error) {
      console.error(`Error seeding user ${user.email}:`, error);
    }
  }
  
  console.log('✅ Users seeded successfully');
}

async function seedEvents() {
  console.log('📅 Seeding events...');
  
  const db = getDbInstance();
  
  for (const event of mockEvents) {
    try {
      db.query(`
        INSERT INTO events (
          title, description, event_type, location, start_date, end_date, 
          max_participants, price, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [
        event.title,
        event.description,
        event.eventType,
        event.location,
        event.startDate.toISOString(),
        event.endDate.toISOString(),
        event.maxParticipants,
        event.price,
        event.status
      ]);
    } catch (error) {
      console.error(`Error seeding event ${event.title}:`, error);
    }
  }
  
  console.log('✅ Events seeded successfully');
}

async function seedEventAdmins() {
  console.log('👤 Adding event admins...');
  
  // Admin users manage all events
  const adminUsers = ['user_1_admin', 'user_2_manager'];
  
  for (const userId of adminUsers) {
    try {
      await db.query(`
        INSERT OR IGNORE INTO event_admins (event_id, user_id, created_at)
        SELECT id, ?, CURRENT_TIMESTAMP FROM events
      `, [userId]);
    } catch (error) {
      console.error(`Error adding event admin ${userId}:`, error);
    }
  }
  
  console.log('✅ Event admins added successfully');
}

async function seedParticipants() {
  console.log('👥 Seeding participants...');
  
  // Add participants to published events (events 1, 2, 3)
  const participantMappings = [
    // Tech Conference 2024 (event_id: 1)
    { userId: 'user_3_participant1', eventId: 1, status: 'REGISTERED' },
    { userId: 'user_4_participant2', eventId: 1, status: 'CHECKED_IN' },
    { userId: 'user_5_participant3', eventId: 1, status: 'REGISTERED' },
    { userId: 'user_8_participant4', eventId: 1, status: 'REGISTERED' },
    { userId: 'user_9_participant5', eventId: 1, status: 'CHECKED_OUT' },
    { userId: 'user_10_participant6', eventId: 1, status: 'WAITLISTED' },
    
    // Webinar Marketing (event_id: 2)
    { userId: 'user_3_participant1', eventId: 2, status: 'REGISTERED' },
    { userId: 'user_4_participant2', eventId: 2, status: 'REGISTERED' },
    { userId: 'user_5_participant3', eventId: 2, status: 'CHECKED_IN' },
    { userId: 'user_8_participant4', eventId: 2, status: 'REGISTERED' },
    
    // Workshop React (event_id: 3) 
    { userId: 'user_4_participant2', eventId: 3, status: 'REGISTERED' },
    { userId: 'user_5_participant3', eventId: 3, status: 'CHECKED_IN' },
  ];

  for (const mapping of participantMappings) {
    try {
      const user = mockUsers.find(u => u.id === mapping.userId);
      const participantEmail = user?.email.replace('@example.com', '@participant.test');
      const participantFirstName = user?.firstName;
      const participantLastName = user?.lastName;

      await db.query(`
        INSERT OR IGNORE INTO event_participant (
          event_id, user_id, email, first_name, last_name, status, registration_date, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [
        mapping.eventId,
        mapping.userId,
        participantEmail || 'unknown@example.com',
        participantFirstName,
        participantLastName,
        mapping.status
      ]);
    } catch (error) {
      console.error(`Error adding participant ${mapping.userId} to event ${mapping.eventId}:`, error);
    }
  }
  
  console.log('✅ Participants seeded successfully');
}

async function seedSpeakers() {
  console.log('🎤 Seeding speakers...');
  
  // Add speakers to events
  const speakerMappings = [
    { userId: 'user_6_speaker1', eventId: 1, status: 'CONFIRMED', bio: 'Expert in AI and Machine Learning with 10+ years of experience' },
    { userId: 'user_7_speaker2', eventId: 1, status: 'CONFIRMED', bio: 'Cloud computing specialist and DevOps consultant' },
    { userId: 'user_7_speaker2', eventId: 3, status: 'INVITED', bio: 'React developer and frontend architect' },
  ];

  for (const mapping of speakerMappings) {
    try {
      const user = mockUsers.find(u => u.id === mapping.userId);
      const speakerEmail = user?.email.replace('@example.com', '@speaker.test');
      const speakerFirstName = user?.firstName;
      const speakerLastName = user?.lastName;

      await db.query(`
        INSERT OR IGNORE INTO event_speaker (
          event_id, user_id, email, first_name, last_name, status, bio, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [
        mapping.eventId,
        mapping.userId,
        speakerEmail || 'unknown@example.com',
        speakerFirstName,
        speakerLastName,
        mapping.status,
        mapping.bio
      ]);
    } catch (error) {
      console.error(`Error adding speaker ${mapping.userId} to event ${mapping.eventId}:`, error);
    }
  }
  
  console.log('✅ Speakers seeded successfully');
}

async function seedSessions() {
  console.log('🎯 Seeding sessions...');
  
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        start_time DATETIME NOT NULL,
        end_time DATETIME NOT NULL,
        room TEXT,
        speaker_id TEXT,
        event_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (speaker_id) REFERENCES users(id),
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
      )
    `);

    for (const session of mockSessions) {
      await db.query(`
        INSERT OR IGNORE INTO sessions (
          title, description, start_time, end_time, room, speaker_id, event_id, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [
        session.title,
        session.description,
        session.startTime.toISOString(),
        session.endTime.toISOString(),
        session.room,
        session.speakerId,
        session.eventId
      ]);
    }
  } catch (error) {
    console.error('Error seeding sessions:', error);
  }
  
  console.log('✅ Sessions seeded successfully');
}

async function seedBudgetItems() {
  console.log('💰 Seeding budget items...');
  
  const budgetItems = [
    // Tech Conference 2024 budget
    { eventId: 1, category: 'venue', description: 'Affitto sala conferenze', budgetedAmount: 5000.00, actualAmount: 5200.00, status: 'paid' },
    { eventId: 1, category: 'catering', description: 'Catering per 150 persone', budgetedAmount: 3000.00, actualAmount: 2850.00, status: 'paid' },
    { eventId: 1, category: 'equipment', description: 'Audio/video equipment rental', budgetedAmount: 1500.00, actualAmount: 1450.00, status: 'paid' },
    { eventId: 1, category: 'marketing', description: 'Digital marketing campaign', budgetedAmount: 2000.00, actualAmount: 1800.00, status: 'committed' },
    { eventId: 1, category: 'travel', description: 'Speaker travel expenses', budgetedAmount: 1000.00, actualAmount: 850.00, status: 'paid' },
  ];

  for (const item of budgetItems) {
    try {
      await db.query(`
        INSERT OR IGNORE INTO event_budget (
          event_id, category, description, budgeted_amount, actual_amount, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [
        item.eventId,
        item.category,
        item.description,
        item.budgetedAmount,
        item.actualAmount,
        item.status
      ]);
    } catch (error) {
      console.error(`Error adding budget item:`, error);
    }
  }
  
  console.log('✅ Budget items seeded successfully');
}

async function seedAnnouncements() {
  console.log('📢 Seeding announcements...');
  
  const announcements = [
    {
      eventId: 1,
      title: 'Benvenuti alla Tech Conference 2024!',
      content: 'Siamo entusiasti di accogliervi alla nostra conferenza annuale. Preparatevi per una giornata piena di innovazione e networking.',
      targetAudience: 'all',
      isEmailSent: true
    },
    {
      eventId: 1,
      title: 'Programma aggiornato',
      content: 'Abbiamo aggiunto una nuova sessione su cybersecurity. Controllate il programma aggiornato.',
      targetAudience: 'participants',
      isEmailSent: false
    },
    {
      eventId: 3,
      title: 'Workshop quasi esaurito',
      content: 'Rimangono pochi posti per il workshop React Advanced. Affrettatevi a registrare!',
      targetAudience: 'all',
      isEmailSent: false
    }
  ];

  for (const announcement of announcements) {
    try {
      await db.query(`
        INSERT OR IGNORE INTO event_announcements (
          event_id, title, content, target_audience, is_email_sent, created_by, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [
        announcement.eventId,
        announcement.title,
        announcement.content,
        announcement.targetAudience,
        announcement.isEmailSent,
        'user_1_admin' // Created by admin
      ]);
    } catch (error) {
      console.error(`Error adding announcement:`, error);
    }
  }
  
  console.log('✅ Announcements seeded successfully');
}

async function seedJobs() {
  console.log('📋 Seeding sample jobs...');
  
  // Create a placeholder table for backup_jobs
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS backup_jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_by TEXT,
        payload TEXT,
        result TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add a sample completed import job
    await db.query(`
      INSERT OR IGNORE INTO backup_jobs (
        type, status, created_by, payload, result, created_at
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, [
      'CSV_IMPORT',
      'COMPLETED',
      'user_1_admin',
      JSON.stringify({ eventId: 1, fileName: 'participants_tech_conference.csv', totalRecords: 15 }),
      JSON.stringify({ successCount: 13, errorCount: 2, errors: ['Email invalid on row 5', 'Duplicate email on row 8'] }),
      new Date('2024-10-19T10:30:00Z').toISOString()
    ]);
  } catch (error) {
    console.error('Error seeding jobs:', error);
  }
  
  console.log('✅ Sample jobs seeded successfully');
}

async function seedDatabase() {
  console.log('🚀 Starting database seeding...');
  
  try {
    await seedUsers();
    await seedEvents();
    await seedEventAdmins();
    await seedParticipants();
    await seedSpeakers();
    await seedSessions();
    await seedBudgetItems();
    await seedAnnouncements();
    await seedJobs();
    
    console.log('\n✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log('👤 Users: 10 (2 admin, 8 regular users)');
    console.log('📅 Events: 5 (3 published, 2 draft)');
    console.log('👥 Participants: 12 registrations across events');
    console.log('🎤 Speakers: 3 speakers assigned to events');
    console.log('🎯 Sessions: 5 sessioni programmate');
    console.log('💰 Budget items: 5 budget items for Tech Conference');
    console.log('📢 Announcements: 3 announcements sent/scheduled');
    console.log('📋 Sample jobs: 1 completed CSV import job');
    
    console.log('\n🔐 Test Credentials:');
    console.log('Admin: admin@agenzia-eventi.com');
    console.log('Manager: manager@agenzia-eventi.com');
    console.log('Participants (sample emails):');
    console.log('- marco.rossi@participant.test');
    console.log('- giulia.bianchi@participant.test');
    console.log('- alessandro.verdi@participant.test');
    
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    throw error;
  } finally {
    await closeDbConnection();
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase().catch(console.error);
}

export { seedDatabase };
