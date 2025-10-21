// src/lib/db/seed_final.ts
import { getDbInstance } from "@/lib/db";

// Mock data
const mockUsers = [
  { id: 'user_1_admin', email: 'admin@agenzia-eventi.com', firstName: 'Admin', lastName: 'User', role: 'admin' },
  { id: 'user_2_manager', email: 'manager@agenzia-eventi.com', firstName: 'Manager', lastName: 'User', role: 'manager' },
  { id: 'user_3_participant1', email: 'marco.rossi@example.com', firstName: 'Marco', lastName: 'Rossi', role: 'user' },
  { id: 'user_4_participant2', email: 'giulia.bianchi@example.com', firstName: 'Giulia', lastName: 'Bianchi', role: 'user' },
  { id: 'user_5_participant3', email: 'alessandro.verdi@example.com', firstName: 'Alessandro', lastName: 'Verdi', role: 'user' },
  { id: 'user_6_speaker1', email: 'anna.ferrari@example.com', firstName: 'Anna', lastName: 'Ferrari', role: 'user' },
  { id: 'user_7_speaker2', email: 'paolo.gallo@example.com', firstName: 'Paolo', lastName: 'Gallo', role: 'user' },
  { id: 'user_8_participant4', email: 'sara.martini@example.com', firstName: 'Sara', lastName: 'Martini', role: 'user' },
  { id: 'user_9_participant5', email: 'lorenzo.conti@example.com', firstName: 'Lorenzo', lastName: 'Conti', role: 'user' },
  { id: 'user_10_participant6', email: 'chiara.romano@example.com', firstName: 'Chiara', lastName: 'Romano', role: 'user' }
];

const mockEvents = [
  {
    title: 'Tech Conference 2024',
    description: 'La conferenza annuale sulle ultime innovazioni tecnologiche. Sessioni su AI, cloud computing, cybersecurity e sviluppo software.',
    eventType: 'conference',
    location: 'Centro Congressi Milano, Via Gattamelata, Milano',
    startDate: '2024-12-15T09:00:00Z',
    endDate: '2024-12-15T18:00:00Z',
    maxParticipants: 150,
    price: 299.99,
    status: 'published'
  },
  {
    title: 'Webinar Marketing Digitale',
    description: 'Strategie avanzate di digital marketing per il 2025. SEO, social media marketing e content strategy.',
    eventType: 'webinar',
    location: 'Online',
    startDate: '2024-11-28T15:00:00Z',
    endDate: '2024-11-28T17:00:00Z',
    maxParticipants: 500,
    price: 49.99,
    status: 'published'
  },
  {
    title: 'Workshop React Advanced',
    description: 'Workshop intensivo su React Hooks, performance optimization e best practices per applicazioni enterprise.',
    eventType: 'workshop',
    location: 'Tech Hub Roma, Via Tiburtina',
    startDate: '2024-12-20T10:00:00Z',
    endDate: '2024-12-20T14:00:00Z',
    maxParticipants: 25,
    price: 149.99,
    status: 'published'
  }
];

async function seedDatabase() {
  console.log('🚀 Starting database seeding...');
  
  const db = getDbInstance();
  
  try {
    // Create required tables
    console.log('🗂️ Creating required tables...');
    
    try {
      db.run(`
        CREATE TABLE IF NOT EXISTS event_participant (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          event_id INTEGER NOT NULL,
          user_id TEXT NOT NULL,
          email TEXT NOT NULL,
          first_name TEXT,
          last_name TEXT,
          status TEXT DEFAULT 'REGISTERED',
          registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
    } catch (error) {
      console.log('event_participant table might already exist:', error.message);
    }

    try {
      db.run(`
        CREATE TABLE IF NOT EXISTS event_speaker (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          event_id INTEGER NOT NULL,
          user_id TEXT NOT NULL,
          email TEXT NOT NULL,
          first_name TEXT,
          last_name TEXT,
          status TEXT DEFAULT 'INVITED',
          bio TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
    } catch (error) {
      console.log('event_speaker table might already exist:', error.message);
    }

    try {
      db.run(`
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
    } catch (error) {
      console.log('backup_jobs table might already exist:', error.message);
    }

    console.log('✅ Tables created/verified');
    
    // Seed Users
    console.log('📝 Seeding users...');
    for (const user of mockUsers) {
      try {
        db.run(`
          INSERT OR IGNORE INTO users (
            id, email, first_name, last_name, role, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `, [user.id, user.email, user.firstName, user.lastName, user.role]);
      } catch (error) {
        console.error(`Error seeding user ${user.email}:`, error);
      }
    }
    console.log('✅ Users seeded successfully');
    
    // Seed Events
    console.log('📅 Seeding events...');
    for (const event of mockEvents) {
      try {
        db.run(`
          INSERT INTO events (
            title, description, event_type, location, start_date, end_date, 
            max_participants, price, status, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `, [
          event.title,
          event.description,
          event.eventType,
          event.location,
          event.startDate,
          event.endDate,
          event.maxParticipants,
          event.price,
          event.status
        ]);
      } catch (error) {
        console.error(`Error seeding event ${event.title}:`, error);
      }
    }
    console.log('✅ Events seeded successfully');
    
    // Add Event Admins
    console.log('👤 Adding event admins...');
    const adminUsers = ['user_1_admin', 'user_2_manager'];
    for (const userId of adminUsers) {
      try {
        db.run(`
          INSERT OR IGNORE INTO event_admins (event_id, user_id, created_at)
          SELECT id, ?, CURRENT_TIMESTAMP FROM events
        `, [userId]);
      } catch (error) {
        console.error(`Error adding event admin ${userId}:`, error);
      }
    }
    console.log('✅ Event admins added successfully');
    
    // Seed Participants
    console.log('👥 Seeding participants...');
    const participantMappings = [
      // Tech Conference 2024 (event_id: 1)
      { userId: 'user_3_participant1', eventId: 1, status: 'REGISTERED', email: 'marco.rossi@participant.test' },
      { userId: 'user_4_participant2', eventId: 1, status: 'CHECKED_IN', email: 'giulia.bianchi@participant.test' },
      { userId: 'user_5_participant3', eventId: 1, status: 'REGISTERED', email: 'alessandro.verdi@participant.test' },
      { userId: 'user_8_participant4', eventId: 1, status: 'REGISTERED', email: 'sara.martini@participant.test' },
      
      // Webinar Marketing (event_id: 2)
      { userId: 'user_3_participant1', eventId: 2, status: 'REGISTERED', email: 'marco.rossi@participant.test' },
      { userId: 'user_4_participant2', eventId: 2, status: 'CHECKED_IN', email: 'giulia.bianchi@participant.test' },
      { userId: 'user_5_participant3', eventId: 2, status: 'REGISTERED', email: 'alessandro.verdi@participant.test' },
      
      // Workshop React (event_id: 3)
      { userId: 'user_4_participant2', eventId: 3, status: 'REGISTERED', email: 'giulia.bianchi@participant.test' },
      { userId: 'user_5_participant3', eventId: 3, status: 'CHECKED_IN', email: 'alessandro.verdi@participant.test' },
    ];

    for (const mapping of participantMappings) {
      try {
        const user = mockUsers.find(u => u.id === mapping.userId);
        db.run(`
          INSERT OR IGNORE INTO event_participant (
            event_id, user_id, email, first_name, last_name, status, registration_date, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `, [
          mapping.eventId,
          mapping.userId,
          mapping.email,
          user?.firstName || '',
          user?.lastName || '',
          mapping.status
        ]);
      } catch (error) {
        console.error(`Error adding participant ${mapping.userId} to event ${mapping.eventId}:`, error);
      }
    }
    console.log('✅ Participants seeded successfully');
    
    // Seed Speakers
    console.log('🎤 Seeding speakers...');
    const speakerMappings = [
      { userId: 'user_6_speaker1', eventId: 1, status: 'CONFIRMED', bio: 'Expert in AI and Machine Learning with 10+ years of experience' },
      { userId: 'user_7_speaker2', eventId: 1, status: 'CONFIRMED', bio: 'Cloud computing specialist and DevOps consultant' },
      { userId: 'user_7_speaker2', eventId: 3, status: 'INVITED', bio: 'React developer and frontend architect' },
    ];

    for (const mapping of speakerMappings) {
      try {
        const user = mockUsers.find(u => u.id === mapping.userId);
        db.run(`
          INSERT OR IGNORE INTO event_speaker (
            event_id, user_id, email, first_name, last_name, status, bio, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `, [
          mapping.eventId,
          mapping.userId,
          user?.email || '',
          user?.firstName || '',
          user?.lastName || '',
          mapping.status,
          mapping.bio
        ]);
      } catch (error) {
        console.error(`Error adding speaker ${mapping.userId} to event ${mapping.eventId}:`, error);
      }
    }
    console.log('✅ Speakers seeded successfully');
    
    // Add sample job
    console.log('📋 Adding sample job...');
    try {
      db.run(`
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
      console.error('Error adding sample job:', error);
    }
    
    console.log('\n✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log('👤 Users: 10 (2 admin, 8 regular users)');
    console.log('📅 Events: 3 published events');
    console.log('👥 Participants: 9 registrations across events');
    console.log('🎤 Speakers: 3 speakers assigned to events');
    console.log('📋 Sample jobs: 1 completed CSV import job');
    
    console.log('\n🔐 Test Credentials:');
    console.log('Admin: admin@agenzia-eventi.com');
    console.log('Manager: manager@agenzia-eventi.com');
    console.log('Participants (sample emails):');
    console.log('- marco.rossi@participant.test');
    console.log('- giulia.bianchi@participant.test');
    console.log('- alessandro.verdi@participant.test');
    
    console.log('\n🎯 Test URLs:');
    console.log('Admin Dashboard: /admin');
    console.log('Events List: /admin/events');
    console.log('Event Participants: /admin/events/1/participants');
    console.log('Public Registration: /events/1/register');
    
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    throw error;
  } finally {
    console.log('📋 Seeding completed');
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase().catch(console.error);
}

export { seedDatabase };
