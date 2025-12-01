-- PostgreSQL Database Schema for GRE Vocabulary Study
-- Run this to create all necessary tables

-- 1. PARTICIPANTS TABLE
CREATE TABLE participants (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    assigned_condition VARCHAR(2) NOT NULL CHECK (assigned_condition IN ('DT', 'CM', 'H')),
    baseline_score INTEGER DEFAULT 0,
    baseline_completed BOOLEAN DEFAULT FALSE,
    words_learned INTEGER DEFAULT 0,
    last_day_completed INTEGER DEFAULT 0,
    day5_test_score INTEGER DEFAULT 0,
    day5_test_completed BOOLEAN DEFAULT FALSE,
    day7_test_score INTEGER DEFAULT 0,
    day7_test_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_session_end TIMESTAMP,
    CONSTRAINT valid_day CHECK (last_day_completed >= 0 AND last_day_completed <= 7)
);

-- 2. BASELINE TESTS TABLE
CREATE TABLE baseline_tests (
    id SERIAL PRIMARY KEY,
    participant_id INTEGER REFERENCES participants(id) ON DELETE CASCADE,
    question_num INTEGER NOT NULL,
    word VARCHAR(100) NOT NULL,
    chosen TEXT NOT NULL,
    correct INTEGER NOT NULL CHECK (correct IN (0, 1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(participant_id, question_num)
);

-- 3. LEARNING TRIALS TABLE (Days 1-4)
CREATE TABLE learning_trials (
    id SERIAL PRIMARY KEY,
    participant_id INTEGER REFERENCES participants(id) ON DELETE CASCADE,
    day INTEGER NOT NULL CHECK (day >= 1 AND day <= 4),
    trial_index INTEGER NOT NULL,
    word_id INTEGER NOT NULL,
    word VARCHAR(100) NOT NULL,
    trial_type VARCHAR(10) NOT NULL CHECK (trial_type IN ('new', 'review')),
    chosen TEXT NOT NULL,
    correct INTEGER NOT NULL CHECK (correct IN (0, 1)),
    new_words_today INTEGER NOT NULL,
    new_words_total INTEGER NOT NULL,
    review_pre_target INTEGER NOT NULL,
    review_post_target INTEGER NOT NULL,
    overshoot INTEGER NOT NULL,
    trial_time_sec DECIMAL(10, 3) NOT NULL,
    session_time_sec DECIMAL(10, 3) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. MEMORY TESTS TABLE (Days 5 & 7)
CREATE TABLE memory_tests (
    id SERIAL PRIMARY KEY,
    participant_id INTEGER REFERENCES participants(id) ON DELETE CASCADE,
    test_day INTEGER NOT NULL CHECK (test_day IN (5, 7)),
    question_num INTEGER NOT NULL,
    word_id INTEGER NOT NULL,
    word VARCHAR(100) NOT NULL,
    chosen TEXT NOT NULL,
    correct INTEGER NOT NULL CHECK (correct IN (0, 1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(participant_id, test_day, question_num)
);

-- INDEXES for performance
CREATE INDEX idx_participants_email ON participants(email);
CREATE INDEX idx_participants_condition ON participants(assigned_condition);
CREATE INDEX idx_baseline_participant ON baseline_tests(participant_id);
CREATE INDEX idx_learning_participant ON learning_trials(participant_id);
CREATE INDEX idx_learning_day ON learning_trials(day);
CREATE INDEX idx_tests_participant ON memory_tests(participant_id);
CREATE INDEX idx_tests_day ON memory_tests(test_day);

-- VIEWS for easy querying

-- View: Participant Summary
CREATE VIEW participant_summary AS
SELECT 
    p.id,
    p.email,
    p.assigned_condition AS condition,
    p.baseline_score,
    p.baseline_completed,
    p.words_learned,
    p.last_day_completed,
    p.day5_test_score,
    p.day5_test_completed,
    p.day7_test_score,
    p.day7_test_completed,
    p.created_at,
    p.last_session_end,
    CASE 
        WHEN p.day7_test_completed THEN 'Complete'
        WHEN p.last_day_completed > 0 THEN 'Active'
        WHEN p.baseline_completed THEN 'Started'
        ELSE 'Registered'
    END AS status
FROM participants p;

-- View: Condition Balance
CREATE VIEW condition_balance AS
SELECT 
    assigned_condition,
    COUNT(*) as participant_count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) as percentage
FROM participants
GROUP BY assigned_condition;

-- View: Learning Progress
CREATE VIEW learning_progress AS
SELECT 
    p.email,
    p.assigned_condition AS condition,
    lt.day,
    COUNT(*) as total_trials,
    COUNT(*) FILTER (WHERE lt.trial_type = 'new') as new_word_trials,
    COUNT(*) FILTER (WHERE lt.trial_type = 'review') as review_trials,
    AVG(lt.correct) as accuracy,
    MAX(lt.new_words_today) as words_learned_that_day,
    MAX(lt.session_time_sec) as total_session_time
FROM participants p
JOIN learning_trials lt ON p.id = lt.participant_id
GROUP BY p.email, p.assigned_condition, lt.day
ORDER BY p.email, lt.day;

-- View: Test Performance
CREATE VIEW test_performance AS
SELECT 
    p.email,
    p.assigned_condition AS condition,
    mt.test_day,
    COUNT(*) as questions_answered,
    SUM(mt.correct) as correct_answers,
    ROUND(AVG(mt.correct) * 100, 1) as accuracy_percentage
FROM participants p
JOIN memory_tests mt ON p.id = mt.participant_id
GROUP BY p.email, p.assigned_condition, mt.test_day
ORDER BY p.email, mt.test_day;

-- Sample queries to verify setup
-- SELECT * FROM participant_summary;
-- SELECT * FROM condition_balance;
-- SELECT * FROM learning_progress;
-- SELECT * FROM test_performance;
