const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// Railway Volume: set DB_PATH=/data/phatphap.db in Railway env vars
// Local: defaults to ./data/phatphap.db
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../data/phatphap.db');

let db;

function getDb() {
  if (!db) {
    // Ensure directory exists (needed for Railway Volume first run)
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

function initDatabase() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      avatar TEXT,
      role TEXT DEFAULT 'user',
      level_id INTEGER DEFAULT 1,
      xp INTEGER DEFAULT 0,
      study_days INTEGER DEFAULT 0,
      last_study_date TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      icon TEXT,
      color TEXT,
      question_count INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS quizzes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      topic_id INTEGER REFERENCES topics(id),
      level TEXT CHECK(level IN ('Cơ bản','Trung cấp','Nâng cao','Chuyên sâu')),
      quiz_type TEXT DEFAULT 'trac_nghiem',
      question_count INTEGER DEFAULT 10,
      time_limit INTEGER DEFAULT 15,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quiz_id INTEGER REFERENCES quizzes(id),
      question TEXT NOT NULL,
      option_a TEXT DEFAULT '',
      option_b TEXT DEFAULT '',
      option_c TEXT DEFAULT '',
      option_d TEXT DEFAULT '',
      correct_answer INTEGER DEFAULT 0,
      explanation TEXT,
      topic_id INTEGER REFERENCES topics(id),
      level TEXT
    );

    CREATE TABLE IF NOT EXISTS quiz_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      quiz_id INTEGER REFERENCES quizzes(id),
      score REAL NOT NULL,
      correct_answers INTEGER,
      total_questions INTEGER,
      time_spent INTEGER,
      passed INTEGER DEFAULT 0,
      completed_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS badges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      color TEXT,
      condition_type TEXT,
      condition_value INTEGER
    );

    CREATE TABLE IF NOT EXISTS user_badges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      badge_id INTEGER REFERENCES badges(id),
      earned_at TEXT DEFAULT (datetime('now')),
      UNIQUE(user_id, badge_id)
    );
  `);

  // Migrations for existing databases
  try { db.exec("ALTER TABLE quizzes ADD COLUMN quiz_type TEXT DEFAULT 'trac_nghiem'"); } catch (_) {}

  // Insert sub-topics (IDs 101–505) to match frontend mockTopics
  const subTopicExists = db.prepare('SELECT id FROM topics WHERE id = 101').get();
  if (!subTopicExists) {
    db.exec(`
      INSERT OR IGNORE INTO topics (id, name, slug, icon, color, question_count) VALUES
      (101,'Luân hồi (Samsara)','luan-hoi','🔄','#D4A017',25),
      (102,'Niết-bàn (Nibbāna)','niet-ban','✨','#D4A017',20),
      (103,'Tam bảo: Phật – Pháp – Tăng','tam-bao','🔱','#D4A017',30),
      (104,'Thập thiện nghiệp','thap-thien-nghiep','🌸','#D4A017',20),
      (105,'Tứ niệm xứ','tu-niem-xu','🧿','#D4A017',25),
      (106,'Ngũ uẩn','ngu-uan','⚗️','#D4A017',30),
      (107,'Thập nhị nhân duyên','thap-nhi-nhan-duyen','⛓️','#D4A017',25),
      (108,'Vô thường – Khổ – Vô ngã','vo-thuong-kho-vo-nga','🌊','#D4A017',25),
      (201,'Trường Bộ Kinh','truong-bo-kinh','📜','#E8890B',25),
      (202,'Trung Bộ Kinh','trung-bo-kinh','📜','#E8890B',25),
      (203,'Tương Ưng Bộ Kinh','tuong-ung-bo-kinh','📜','#E8890B',20),
      (204,'Tăng Chi Bộ Kinh','tang-chi-bo-kinh','📜','#E8890B',20),
      (205,'Tiểu Bộ Kinh','tieu-bo-kinh','📜','#E8890B',20),
      (206,'Trường A hàm','truong-a-ham','📚','#E8890B',15),
      (207,'Trung A hàm','trung-a-ham','📚','#E8890B',15),
      (208,'Tạp A hàm','tap-a-ham','📚','#E8890B',15),
      (209,'Tăng nhất A hàm','tang-nhat-a-ham','📚','#E8890B',15),
      (301,'Tại gia','tai-gia','🏠','#0ea5e9',30),
      (302,'Sa di','sa-di','🪷','#0ea5e9',20),
      (303,'Tỳ kheo','ty-kheo','🧘','#0ea5e9',25),
      (304,'Sa di ni','sa-di-ni','🌺','#0ea5e9',15),
      (305,'Thức xoa ma na','thuc-xoa-ma-na','☸️','#0ea5e9',15),
      (306,'Tỳ kheo ni','ty-kheo-ni','🧘🏽','#0ea5e9',15),
      (401,'Thiền chỉ (Samatha)','thien-chi','🕯️','#10b981',45),
      (402,'Thiền quán (Vipassanā)','thien-quan','👁️','#10b981',45),
      (501,'LS Phật Giáo Ấn Độ','ls-an-do','🪔','#8b5cf6',25),
      (502,'LS Phật Giáo Sri Lanka','ls-sri-lanka','🌴','#8b5cf6',15),
      (503,'LS Phật Giáo Trung Quốc','ls-trung-quoc','🏯','#8b5cf6',20),
      (504,'LS Phật Giáo Việt Nam','ls-viet-nam','🇻🇳','#8b5cf6',25),
      (505,'Cuộc đời Đức Phật Thích Ca','cuoc-doi-duc-phat','⭐','#8b5cf6',15)
    `);
    console.log('✅ Sub-topics inserted');
  }

  seedData(db);
  console.log('✅ Database initialized');
}

function seedData(db) {
  const userCount = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
  if (userCount > 0) return;

  // Seed topics
  const topics = [
    { name: 'Tứ Diệu Đế', slug: 'tu-dieu-de', icon: '☸️', color: '#D4A017', question_count: 45 },
    { name: 'Bát Chánh Đạo', slug: 'bat-chanh-dao', icon: '🔱', color: '#E8890B', question_count: 60 },
    { name: 'Nhân Quả Nghiệp Báo', slug: 'nhan-qua-nghiep-bao', icon: '⚖️', color: '#9333ea', question_count: 50 },
    { name: 'Giới Luật', slug: 'gioi-luat', icon: '📿', color: '#0ea5e9', question_count: 40 },
    { name: 'Thiền Định', slug: 'thien-dinh', icon: '🧘', color: '#10b981', question_count: 45 },
    { name: 'Kinh Điển', slug: 'kinh-dien', icon: '📖', color: '#f97316', question_count: 80 },
    { name: 'Lịch Sử Phật Giáo', slug: 'lich-su-phat-giao', icon: '🏛️', color: '#64748b', question_count: 70 },
  ];

  const insertTopic = db.prepare(
    'INSERT INTO topics (name, slug, icon, color, question_count) VALUES (?, ?, ?, ?, ?)'
  );
  topics.forEach(t => insertTopic.run(t.name, t.slug, t.icon, t.color, t.question_count));

  // Seed badges
  const badges = [
    { name: 'Học viên Xuất sắc', description: 'Đạt điểm 90%+ trong 5 bài thi', icon: '🥇', color: '#D4A017' },
    { name: 'Chuyên gia Tứ Diệu Đế', description: 'Hoàn thành tất cả bài thi về Tứ Diệu Đế', icon: '🏆', color: '#C0C0C0' },
    { name: 'Tinh tấn 7 ngày', description: 'Học liên tục 7 ngày', icon: '🔥', color: '#E8890B' },
    { name: 'Kiến thức Toàn diện', description: 'Hoàn thành bài thi ở cả 4 cấp độ', icon: '💎', color: '#0ea5e9' },
    { name: 'Sơ tâm', description: 'Hoàn thành bài thi đầu tiên', icon: '🌱', color: '#10b981' },
    { name: 'Pháp Hữu', description: 'Tham gia cộng đồng hỏi đáp', icon: '🤝', color: '#8b5cf6' },
  ];

  const insertBadge = db.prepare(
    'INSERT INTO badges (name, description, icon, color) VALUES (?, ?, ?, ?)'
  );
  badges.forEach(b => insertBadge.run(b.name, b.description, b.icon, b.color));

  // Seed users
  const hash = bcrypt.hashSync('password123', 10);
  const adminHash = bcrypt.hashSync('admin123', 10);

  const insertUser = db.prepare(
    'INSERT INTO users (name, email, password, role, level_id, xp, study_days) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );

  const users = [
    { name: 'Admin', email: 'admin@phatphap.vn', password: adminHash, role: 'admin', level_id: 4, xp: 3200, study_days: 30 },
    { name: 'Minh Tâm', email: 'minhtam@gmail.com', password: hash, role: 'user', level_id: 2, xp: 720, study_days: 7 },
    { name: 'Tuệ Minh', email: 'tueming@gmail.com', password: hash, role: 'user', level_id: 3, xp: 960, study_days: 14 },
    { name: 'Pháp Hạnh', email: 'phaph@gmail.com', password: hash, role: 'user', level_id: 2, xp: 680, study_days: 10 },
    { name: 'Diệu Hạnh', email: 'dieuhanh@gmail.com', password: hash, role: 'user', level_id: 2, xp: 620, study_days: 8 },
    { name: 'Tâm Bình', email: 'tambinh@gmail.com', password: hash, role: 'user', level_id: 1, xp: 340, study_days: 5 },
    { name: 'Từ Bi', email: 'tubi@gmail.com', password: hash, role: 'user', level_id: 3, xp: 890, study_days: 12 },
    { name: 'Hỷ Xả', email: 'hyxa@gmail.com', password: hash, role: 'user', level_id: 2, xp: 580, study_days: 6 },
  ];

  users.forEach(u => insertUser.run(u.name, u.email, u.password, u.role, u.level_id, u.xp, u.study_days));

  // Seed quizzes
  const insertQuiz = db.prepare(
    'INSERT INTO quizzes (title, description, topic_id, level, question_count, time_limit) VALUES (?, ?, ?, ?, ?, ?)'
  );

  const quizzes = [
    { title: 'Thi trắc nghiệm Tứ Diệu Đế', desc: 'Kiểm tra kiến thức về Khổ, Tập, Diệt, Đạo', topic: 1, level: 'Cơ bản', qCount: 10, time: 15 },
    { title: 'Thi trắc nghiệm Bát Chánh Đạo', desc: 'Hiểu về 8 nhánh của con đường Giải thoát', topic: 2, level: 'Trung cấp', qCount: 15, time: 20 },
    { title: 'Thi trắc nghiệm Nhân Quả', desc: 'Luật nhân quả và nghiệp báo trong Phật giáo', topic: 3, level: 'Trung cấp', qCount: 12, time: 18 },
    { title: 'Thi tự luận: Ý nghĩa Vô thường', desc: 'Phân tích sâu về vô thường trong cuộc sống', topic: 6, level: 'Nâng cao', qCount: 8, time: 30 },
    { title: 'Tứ Diệu Đế - Nâng cao', desc: 'Nghiên cứu chuyên sâu về Tứ Diệu Đế', topic: 1, level: 'Nâng cao', qCount: 20, time: 25 },
    { title: 'Thiền Định cơ bản', desc: 'Các phương pháp thiền định căn bản', topic: 5, level: 'Cơ bản', qCount: 10, time: 15 },
    { title: 'Giới luật Phật tử', desc: 'Ngũ giới và các giới luật cơ bản', topic: 4, level: 'Cơ bản', qCount: 10, time: 15 },
    { title: 'Kinh Điển Pali', desc: 'Tổng quan về hệ thống Kinh tạng Pali', topic: 6, level: 'Chuyên sâu', qCount: 25, time: 40 },
    { title: 'Lịch sử Phật giáo Việt Nam', desc: 'Quá trình du nhập và phát triển Phật giáo ở VN', topic: 7, level: 'Trung cấp', qCount: 15, time: 20 },
    { title: 'Bát Chánh Đạo - Chuyên sâu', desc: 'Thực hành Bát Chánh Đạo trong đời sống', topic: 2, level: 'Chuyên sâu', qCount: 20, time: 30 },
  ];

  quizzes.forEach(q => insertQuiz.run(q.title, q.desc, q.topic, q.level, q.qCount, q.time));

  // Seed sample questions for quiz 1
  const insertQ = db.prepare(
    `INSERT INTO questions (quiz_id, question, option_a, option_b, option_c, option_d, correct_answer, explanation, topic_id, level)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const questions = [
    [1, 'Tứ Diệu Đế là gì?', 'Bốn điều chân thật cao quý', 'Bốn vị thần hộ pháp', 'Bốn loại thiền định', 'Bốn giai đoạn giác ngộ', 1, 'Tứ Diệu Đế (Cattāri Ariyasaccāni) là bốn sự thật cao quý được Đức Phật giảng dạy', 1, 'Cơ bản'],
    [1, 'Khổ Đế (Dukkha) nghĩa là gì?', 'Sự đau khổ trong cuộc sống', 'Niềm vui trong tu hành', 'Con đường giải thoát', 'Nguyên nhân của hạnh phúc', 1, 'Khổ Đế chỉ ra rằng cuộc sống chứa đựng khổ đau, bao gồm sinh, lão, bệnh, tử...', 1, 'Cơ bản'],
    [1, 'Tập Đế (Samudaya) chỉ điều gì?', 'Nguyên nhân của khổ đau', 'Sự chấm dứt khổ đau', 'Con đường thoát khổ', 'Sự thật về hạnh phúc', 1, 'Tập Đế chỉ ra nguyên nhân của khổ đau là tham ái (taṇhā)', 1, 'Cơ bản'],
    [1, 'Diệt Đế (Nirodha) là gì?', 'Sự chấm dứt hoàn toàn khổ đau - Niết Bàn', 'Sự diệt trừ kẻ thù', 'Cách diệt ác nghiệp', 'Thực hành khổ hạnh', 1, 'Diệt Đế chỉ ra sự chấm dứt hoàn toàn của tham ái, dẫn đến Niết Bàn', 1, 'Cơ bản'],
    [1, 'Đạo Đế (Magga) là gì?', 'Con đường dẫn đến chấm dứt khổ đau', 'Các quy tắc đạo đức', 'Phương pháp thiền định', 'Bộ kinh quan trọng', 1, 'Đạo Đế là con đường Bát Chánh Đạo dẫn đến sự chấm dứt khổ đau', 1, 'Cơ bản'],
  ];

  questions.forEach(q => insertQ.run(...q));

  // Seed quiz results for user 2 (Minh Tâm)
  const insertResult = db.prepare(
    'INSERT INTO quiz_results (user_id, quiz_id, score, correct_answers, total_questions, time_spent, passed, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );

  const results = [
    [2, 1, 90, 9, 10, 12, 1, datetime(-5)],
    [2, 2, 85, 13, 15, 18, 1, datetime(-4)],
    [2, 3, 78, 9, 12, 16, 1, datetime(-3)],
    [2, 4, 88, 7, 8, 25, 1, datetime(-2)],
    [2, 6, 80, 8, 10, 14, 1, datetime(-1)],
    [3, 1, 95, 10, 10, 10, 1, datetime(-3)],
    [3, 2, 90, 14, 15, 15, 1, datetime(-2)],
    [4, 1, 82, 8, 10, 13, 1, datetime(-4)],
    [4, 3, 75, 9, 12, 17, 1, datetime(-2)],
  ];

  results.forEach(r => insertResult.run(...r));

  // Assign badges to users
  const insertUserBadge = db.prepare(
    'INSERT OR IGNORE INTO user_badges (user_id, badge_id) VALUES (?, ?)'
  );
  [[2, 1], [2, 3], [2, 4], [2, 5], [3, 1], [3, 2], [3, 3], [4, 5]].forEach(([u, b]) =>
    insertUserBadge.run(u, b)
  );

  console.log('✅ Seed data inserted');
}

function datetime(daysOffset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().replace('T', ' ').split('.')[0];
}

module.exports = { getDb, initDatabase };
