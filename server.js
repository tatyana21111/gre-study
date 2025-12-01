// server.js - Node.js + PostgreSQL Backend for GRE Study
// Run with: node server.js

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
const app = express();
app.disable('etag');

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// PostgreSQL Connection
const pool = new Pool({
  host: 'localhost',     // Change to your PostgreSQL host
  port: 5432,            // Default PostgreSQL port
  database: 'gre_study', // Your database name
  user: 'tangziyi', // Your PostgreSQL username
  password: '' // Your PostgreSQL password
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('✅ PostgreSQL connected:', res.rows[0].now);
  }
});

// ==================== API ENDPOINTS ====================

// 1. CREATE PARTICIPANT (or get existing)
app.post('/api/participant', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if participant exists
    let result = await pool.query(
      'SELECT * FROM participants WHERE email = $1',
      [email]
    );
    
    if (result.rows.length > 0) {
      // Existing participant
      return res.json({
        success: true,
        participant: result.rows[0],
        isNew: false
      });
    }
    
    // New participant - assign condition
    const conditions = ['DT', 'CM', 'H'];
    
    // Get current counts
    const counts = await pool.query(
      'SELECT assigned_condition, COUNT(*) as count FROM participants GROUP BY assigned_condition'
    );
    
    const countMap = { DT: 0, CM: 0, H: 0 };
    counts.rows.forEach(row => {
      countMap[row.assigned_condition] = parseInt(row.count);
    });
    
    // Assign to condition with fewest participants
    const minCount = Math.min(...Object.values(countMap));
    const availableConditions = conditions.filter(c => countMap[c] === minCount);
    const assignedCondition = availableConditions[Math.floor(Math.random() * availableConditions.length)];
      
      
    // Insert new participant
    result = await pool.query(
      `INSERT INTO participants (email, assigned_condition, created_at) 
       VALUES ($1, $2, NOW()) 
       RETURNING *`,
      [email, assignedCondition]
    );
    
    res.json({
      success: true,
      participant: result.rows[0],
      isNew: true
    });
    
  } catch (error) {
    console.error('Error creating participant:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. SAVE BASELINE TEST
app.post('/api/baseline', async (req, res) => {
  console.log('Received Baseline Data:', req.body);
  try {
    let { participantId, answers, score } = req.body;
    
    console.log('Looking for participant for baseline:', participantId);
    
    // Find participant by email
    const participantResult = await pool.query(
      'SELECT id FROM participants WHERE email = $1', 
      [participantId]
    );
    
    if (participantResult.rows.length === 0) {
      console.log('Participant not found for baseline:', participantId);
      return res.status(404).json({ success: false, error: 'Participant not found' });
    }
    
    const participantDbId = participantResult.rows[0].id;
    
    // Update participant baseline score
    await pool.query(
      'UPDATE participants SET baseline_score = $1, baseline_completed = true WHERE id = $2',
      [score, participantDbId]
    );
    
    // Insert baseline answers
    for (let i = 0; i < answers.length; i++) {
      const ans = answers[i];
      await pool.query(
        `INSERT INTO baseline_tests (participant_id, question_num, word, chosen, correct) 
         VALUES ($1, $2, $3, $4, $5)`,
        [participantDbId, i + 1, ans.word, ans.chosen, ans.correct]
      );
    }
    
    console.log('✅ Baseline data saved successfully for participant:', participantId);
    res.json({ success: true });
    
  } catch (error) {
    console.error('Error saving baseline:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. SAVE LEARNING SESSION
app.post('/api/session', async (req, res) => {
  console.log('➡️ /api/session hit with body:', req.body);
  try {
    let { participantId, day, trials } = req.body;
    
    console.log('Looking for participant:', participantId);
    
    // FIRST, find the participant by email and get their ID
    const participantResult = await pool.query(
      'SELECT id FROM participants WHERE email = $1', 
      [participantId]
    );
    
    if (participantResult.rows.length === 0) {
      console.log('Participant not found for email:', participantId);
      return res.status(404).json({ success: false, error: 'Participant not found' });
    }
    
    const participantDbId = participantResult.rows[0].id;
    console.log('Found participant ID:', participantDbId);
    
    // Update participant progress
    await pool.query(
      `UPDATE participants 
       SET last_day_completed = GREATEST(last_day_completed, $1),
           words_learned = (SELECT COUNT(DISTINCT word_id) FROM learning_trials WHERE participant_id = $2),
           last_session_end = NOW()
       WHERE id = $2`,
      [day, participantDbId]
    );
    
    // Insert all trials
    for (const trial of trials) {
      await pool.query(
        `INSERT INTO learning_trials (
          participant_id, day, trial_index, word_id, word, trial_type, 
          chosen, correct, new_words_today, new_words_total, 
          review_pre_target, review_post_target, overshoot, 
          trial_time_sec, session_time_sec
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          participantDbId, trial.day, trial.trialIndex, trial.wordId, trial.word,
          trial.type, trial.chosen, trial.correct, trial.newWordsToday, 
          trial.newWordsTotal, trial.reviewPreTarget, trial.reviewPostTarget,
          trial.overshoot, trial.trialTimeSec, trial.sessionTimeSec
        ]
      );
    }
    
    console.log('✅ Session data saved successfully for participant:', participantId);
    res.json({ success: true });
    
  } catch (error) {
    console.error('Error saving session:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. SAVE MEMORY TEST (Day 5 or 7)
app.post('/api/test', async (req, res) => {
  try {
    let { participantId, testDay, answers, score } = req.body;
    
    console.log('Looking for participant for test:', participantId);
    
    // Find participant by email
    const participantResult = await pool.query(
      'SELECT id FROM participants WHERE email = $1', 
      [participantId]
    );
    
    if (participantResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Participant not found' });
    }
    
    const participantDbId = participantResult.rows[0].id;
    
    // Update participant test scores
    if (testDay === 5) {
      await pool.query(
        'UPDATE participants SET day5_test_score = $1, day5_test_completed = true WHERE id = $2',
        [score, participantDbId]
      );
    } else if (testDay === 7) {
      await pool.query(
        'UPDATE participants SET day7_test_score = $1, day7_test_completed = true WHERE id = $2',
        [score, participantDbId]
      );
    }
    
    // Insert test answers
    for (let i = 0; i < answers.length; i++) {
      const ans = answers[i];
      await pool.query(
        `INSERT INTO memory_tests (participant_id, test_day, question_num, word_id, word, chosen, correct)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [participantDbId, testDay, i + 1, ans.wordId, ans.word, ans.chosen, ans.correct]
      );
    }
    
    console.log('✅ Test data saved successfully for participant:', participantId);
    res.json({ success: true });
    
  } catch (error) {
    console.error('Error saving test:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
// 5. CHECK SESSION PERMISSION (24-hour lockout)
app.get('/api/check-session/:participantId', async (req, res) => {
  try {
    const { participantId } = req.params;
    
    const result = await pool.query(
      'SELECT last_session_end FROM participants WHERE id = $1',
      [participantId]
    );
    
    if (result.rows.length === 0) {
      return res.json({ canStart: true });
    }
    
    const lastSession = result.rows[0].last_session_end;
    if (!lastSession) {
      return res.json({ canStart: true });
    }
    
    const now = new Date();
    const lastSessionDate = new Date(lastSession);
    const hoursSince = (now - lastSessionDate) / (1000 * 60 * 60);
    
    res.json({
      canStart: hoursSince >= 24,
      lastSession: lastSession,
      nextAllowed: new Date(lastSessionDate.getTime() + 24 * 60 * 60 * 1000)
    });
    
  } catch (error) {
    console.error('Error checking session:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. GET PARTICIPANT DATA
app.get('/api/participant/:participantId', async (req, res) => {
  try {
    const { participantId } = req.params;
    
    const participant = await pool.query(
      'SELECT * FROM participants WHERE id = $1',
      [participantId]
    );
    
    if (participant.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Participant not found' });
    }
    
    res.json({
      success: true,
      participant: participant.rows[0]
    });
    
  } catch (error) {
    console.error('Error getting participant:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== RESEARCHER ENDPOINTS ====================

// 7. GET ALL PARTICIPANTS (for researcher dashboard)
app.get('/api/admin/participants', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, email, assigned_condition, baseline_score, baseline_completed,
              words_learned, last_day_completed, day5_test_score, day7_test_score,
              day5_test_completed, day7_test_completed, created_at, last_session_end
       FROM participants 
       ORDER BY created_at DESC`
    );
    
    res.json({ success: true, participants: result.rows });
    
  } catch (error) {
    console.error('Error getting participants:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 8. GET ALL LEARNING SESSION DATA
app.get('/api/admin/learning-data', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT lt.*, p.email, p.assigned_condition
       FROM learning_trials lt
       JOIN participants p ON lt.participant_id = p.id
       ORDER BY lt.participant_id, lt.day, lt.trial_index`
    );
    
    res.json({ success: true, data: result.rows });
    
  } catch (error) {
    console.error('Error getting learning data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 9. GET ALL TEST DATA
app.get('/api/admin/test-data', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT mt.*, p.email, p.assigned_condition
       FROM memory_tests mt
       JOIN participants p ON mt.participant_id = p.id
       ORDER BY mt.participant_id, mt.test_day, mt.question_num`
    );
    
    res.json({ success: true, data: result.rows });
    
  } catch (error) {
    console.error('Error getting test data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 10. GET ALL BASELINE DATA
app.get('/api/admin/baseline-data', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT bt.*, p.email, p.assigned_condition
       FROM baseline_tests bt
       JOIN participants p ON bt.participant_id = p.id
       ORDER BY bt.participant_id, bt.question_num`
    );
    
    res.json({ success: true, data: result.rows });
    
  } catch (error) {
    console.error('Error getting baseline data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 11. GET STATISTICS
app.get('/api/admin/stats', async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_participants,
        COUNT(*) FILTER (WHERE baseline_completed = true) as completed_baseline,
        COUNT(*) FILTER (WHERE last_day_completed > 0 AND last_day_completed < 7) as active_learners,
        COUNT(*) FILTER (WHERE day7_test_completed = true) as completed_study,
        COUNT(*) FILTER (WHERE assigned_condition = 'DT') as dt_count,
        COUNT(*) FILTER (WHERE assigned_condition = 'CM') as cm_count,
        COUNT(*) FILTER (WHERE assigned_condition = 'H') as h_count
      FROM participants
    `);
    
    res.json({ success: true, stats: stats.rows[0] });
    
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});
