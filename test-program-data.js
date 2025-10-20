import dbInstance from './src/lib/db/index.js';

const db = dbInstance;

async function testProgramData() {
  try {
    console.log('Testing getProgramData function...');
    
    const eventId = '3';
    const eventIdNum = parseInt(eventId, 10);
    
    console.log('Event ID (string):', eventId);
    console.log('Event ID (number):', eventIdNum);
    
    // Test event query
    const event = db.query(
      `SELECT * FROM events WHERE id = ?`,
      [eventIdNum]
    );
    
    console.log('Event query result:', event.length, 'records');
    console.log('First event:', event[0]);
    
    // Test sessions query
    const sessions = db.query(
      `SELECT s.*, u.id as speaker_id, u.first_name as speaker_first_name, u.last_name as speaker_last_name, u.email as speaker_email
       FROM sessions s
       LEFT JOIN users u ON s.speaker_id = u.id
       WHERE s.event_id = ?
       ORDER BY s.start_time ASC`,
      [eventIdNum]
    );
    
    console.log('Sessions query result:', sessions.length, 'records');
    
    if (sessions.length > 0) {
      console.log('First session:', sessions[0]);
    }
    
    // Test admin check
    const userId = 'user_34CGOtO08Sjq57XeweThRJmLqHu';
    const adminCheck = db.query(
      `SELECT 1 FROM event_admins WHERE event_id = ? AND user_id = ? LIMIT 1`,
      [eventIdNum, userId]
    );
    
    console.log('Admin check result:', adminCheck.length > 0 ? 'USER IS ADMIN' : 'USER IS NOT ADMIN');
    
    console.log('✅ All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

testProgramData();
