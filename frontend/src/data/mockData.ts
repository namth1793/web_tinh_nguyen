import { User, Badge, Topic, SubTopic, Quiz, QuizResult, LeaderboardEntry, UserStats } from '@/types';

export const mockUser: User = {
  id: 2,
  name: 'Minh Tâm',
  email: 'minhtam@gmail.com',
  role: 'user',
  level_id: 3,
  xp: 720,
  study_days: 7,
  created_at: '2024-01-01',
  totalQuizzes: 24,
  avgScore: 85.6,
  rank: 2,
};

export const mockStats: UserStats = {
  total_quizzes: 24,
  avg_score: 85.6,
  passed_count: 22,
  total_correct: 486,
  total_questions: 600,
  xp: 720,
  study_days: 7,
  rank: 2,
  totalUsers: 8,
  rankPercentage: 38,
};

// Stats cho người dùng mới (chưa thi lần nào)
export const EMPTY_STATS: UserStats = {
  total_quizzes: 0,
  avg_score: 0,
  passed_count: 0,
  total_correct: 0,
  total_questions: 0,
  xp: 0,
  study_days: 0,
  rank: 0,
  totalUsers: 0,
  rankPercentage: 100,
};

export const mockBadges: Badge[] = [
  { id: 1, name: 'Học viên Xuất sắc', description: 'Đạt điểm 90%+ trong 5 bài thi', icon: '🥇', color: '#D4A017' },
  { id: 2, name: 'Chuyên gia Tứ Diệu Đế', description: 'Hoàn thành tất cả bài Tứ Diệu Đế', icon: '🏆', color: '#C0C0C0' },
  { id: 3, name: 'Tinh tấn 7 ngày', description: 'Học liên tục 7 ngày', icon: '🔥', color: '#E8890B' },
  { id: 4, name: 'Kiến thức Toàn diện', description: 'Hoàn thành bài thi ở cả 4 cấp độ', icon: '💎', color: '#0ea5e9' },
  { id: 5, name: 'Sơ tâm', description: 'Hoàn thành bài thi đầu tiên', icon: '🌱', color: '#10b981' },
  { id: 6, name: 'Pháp Hữu', description: 'Tham gia cộng đồng hỏi đáp', icon: '🤝', color: '#8b5cf6' },
];

export const mockTopics: Topic[] = [
  {
    id: 1, name: 'Chủ Đề', slug: 'chu-de', icon: '☸️', color: '#D4A017', question_count: 200,
    children: [
      { id: 101, name: 'Luân hồi (Samsara)',              slug: 'luan-hoi',             icon: '🔄', color: '#D4A017', question_count: 25, parent_id: 1 },
      { id: 102, name: 'Niết-bàn (Nibbāna)',              slug: 'niet-ban',              icon: '✨', color: '#D4A017', question_count: 20, parent_id: 1 },
      { id: 103, name: 'Tam bảo: Phật – Pháp – Tăng',    slug: 'tam-bao',               icon: '🔱', color: '#D4A017', question_count: 30, parent_id: 1 },
      { id: 104, name: 'Thập thiện nghiệp',               slug: 'thap-thien-nghiep',     icon: '🌸', color: '#D4A017', question_count: 20, parent_id: 1 },
      { id: 105, name: 'Tứ niệm xứ',                     slug: 'tu-niem-xu',            icon: '🧿', color: '#D4A017', question_count: 25, parent_id: 1 },
      { id: 106, name: 'Ngũ uẩn (sắc, thọ, tưởng, hành, thức)', slug: 'ngu-uan',       icon: '⚗️', color: '#D4A017', question_count: 30, parent_id: 1 },
      { id: 107, name: 'Thập nhị nhân duyên',             slug: 'thap-nhi-nhan-duyen',   icon: '⛓️', color: '#D4A017', question_count: 25, parent_id: 1 },
      { id: 108, name: 'Vô thường – Khổ – Vô ngã',        slug: 'vo-thuong-kho-vo-nga',  icon: '🌊', color: '#D4A017', question_count: 25, parent_id: 1 },
    ],
  },
  {
    id: 2, name: 'Kinh', slug: 'kinh', icon: '📖', color: '#E8890B', question_count: 180,
    children: [
      { id: 201, name: 'Trường Bộ Kinh (Dīgha Nikāya)',        slug: 'truong-bo-kinh',    icon: '📜', color: '#E8890B', question_count: 25, parent_id: 2 },
      { id: 202, name: 'Trung Bộ Kinh (Majjhima Nikāya)',      slug: 'trung-bo-kinh',     icon: '📜', color: '#E8890B', question_count: 25, parent_id: 2 },
      { id: 203, name: 'Tương Ưng Bộ Kinh (Saṃyutta Nikāya)', slug: 'tuong-ung-bo-kinh', icon: '📜', color: '#E8890B', question_count: 20, parent_id: 2 },
      { id: 204, name: 'Tăng Chi Bộ Kinh (Aṅguttara Nikāya)', slug: 'tang-chi-bo-kinh',  icon: '📜', color: '#E8890B', question_count: 20, parent_id: 2 },
      { id: 205, name: 'Tiểu Bộ Kinh (Khuddaka Nikāya)',       slug: 'tieu-bo-kinh',      icon: '📜', color: '#E8890B', question_count: 20, parent_id: 2 },
      { id: 206, name: 'Trường A hàm (Dīrgha Āgama)',          slug: 'truong-a-ham',      icon: '📚', color: '#E8890B', question_count: 15, parent_id: 2 },
      { id: 207, name: 'Trung A hàm (Madhyama Āgama)',         slug: 'trung-a-ham',       icon: '📚', color: '#E8890B', question_count: 15, parent_id: 2 },
      { id: 208, name: 'Tạp A hàm (Saṃyukta Āgama)',          slug: 'tap-a-ham',         icon: '📚', color: '#E8890B', question_count: 15, parent_id: 2 },
      { id: 209, name: 'Tăng nhất A hàm (Ekottara Āgama)',     slug: 'tang-nhat-a-ham',   icon: '📚', color: '#E8890B', question_count: 15, parent_id: 2 },
    ],
  },
  {
    id: 3, name: 'Giới Luật', slug: 'gioi-luat', icon: '📿', color: '#0ea5e9', question_count: 120,
    children: [
      { id: 301, name: 'Tại gia',         slug: 'tai-gia',    icon: '🏠',   color: '#0ea5e9', question_count: 30, parent_id: 3 },
      { id: 302, name: 'Sa di',           slug: 'sa-di',      icon: '🪷',   color: '#0ea5e9', question_count: 20, parent_id: 3 },
      { id: 303, name: 'Tỳ kheo',         slug: 'ty-kheo',    icon: '🧘',   color: '#0ea5e9', question_count: 25, parent_id: 3 },
      { id: 304, name: 'Sa di ni',        slug: 'sa-di-ni',   icon: '🌺',   color: '#0ea5e9', question_count: 15, parent_id: 3 },
      { id: 305, name: 'Thức xoa ma na',  slug: 'thuc-xoa-ma-na', icon: '☸️', color: '#0ea5e9', question_count: 15, parent_id: 3 },
      { id: 306, name: 'Tỳ kheo ni',      slug: 'ty-kheo-ni', icon: '🧘', color: '#0ea5e9', question_count: 15, parent_id: 3 },
    ],
  },
  {
    id: 4, name: 'Thiền', slug: 'thien', icon: '🧘', color: '#10b981', question_count: 90,
    children: [
      { id: 401, name: 'Thiền chỉ (Samatha)',   slug: 'thien-chi',  icon: '🕯️', color: '#10b981', question_count: 45, parent_id: 4 },
      { id: 402, name: 'Thiền quán (Vipassanā)', slug: 'thien-quan', icon: '👁️', color: '#10b981', question_count: 45, parent_id: 4 },
    ],
  },
  {
    id: 5, name: 'Lịch Sử Phật Giáo', slug: 'lich-su-phat-giao', icon: '🏛️', color: '#8b5cf6', question_count: 100,
    children: [
      { id: 501, name: 'LS Phật Giáo Ấn Độ',            slug: 'ls-an-do',         icon: '🪔', color: '#8b5cf6', question_count: 25, parent_id: 5 },
      { id: 502, name: 'LS Phật Giáo Sri Lanka',         slug: 'ls-sri-lanka',     icon: '🌴', color: '#8b5cf6', question_count: 15, parent_id: 5 },
      { id: 503, name: 'LS Phật Giáo Trung Quốc',        slug: 'ls-trung-quoc',    icon: '🏯', color: '#8b5cf6', question_count: 20, parent_id: 5 },
      { id: 504, name: 'LS Phật Giáo Việt Nam',          slug: 'ls-viet-nam',      icon: '🇻🇳', color: '#8b5cf6', question_count: 25, parent_id: 5 },
      { id: 505, name: 'Cuộc đời Đức Phật Thích Ca',     slug: 'cuoc-doi-duc-phat', icon: '⭐', color: '#8b5cf6', question_count: 15, parent_id: 5 },
    ],
  },
];

// Helper: lấy tất cả sub-topic phẳng
export const allSubTopics: SubTopic[] = mockTopics.flatMap(t => t.children ?? []);

// Helper: lấy sub-topic IDs của một parent
export function getChildIds(parentId: number): number[] {
  return mockTopics.find(t => t.id === parentId)?.children?.map(c => c.id) ?? [];
}

export const mockQuizzes: Quiz[] = [
  { id: 1, title: 'Vô thường – Khổ – Vô ngã cơ bản',     topic_id: 108, topic_name: 'Vô thường – Khổ – Vô ngã',       topic_icon: '🌊', topic_color: '#D4A017', level: 'Cơ bản',    question_count: 10, time_limit: 15 },
  { id: 2, title: 'Tứ niệm xứ nâng cao',                  topic_id: 105, topic_name: 'Tứ niệm xứ',                      topic_icon: '🧿', topic_color: '#D4A017', level: 'Trung cấp', question_count: 15, time_limit: 20 },
  { id: 3, title: 'Luân hồi và Nghiệp báo',               topic_id: 101, topic_name: 'Luân hồi (Samsara)',               topic_icon: '🔄', topic_color: '#D4A017', level: 'Trung cấp', question_count: 12, time_limit: 18 },
  { id: 4, title: 'Trường Bộ Kinh – Đại kinh',            topic_id: 201, topic_name: 'Trường Bộ Kinh (Dīgha Nikāya)',    topic_icon: '📜', topic_color: '#E8890B', level: 'Nâng cao',  question_count: 8,  time_limit: 30 },
  { id: 5, title: 'Thập nhị nhân duyên chuyên sâu',       topic_id: 107, topic_name: 'Thập nhị nhân duyên',              topic_icon: '⛓️', topic_color: '#D4A017', level: 'Nâng cao',  question_count: 20, time_limit: 25 },
  { id: 6, title: 'Thiền chỉ (Samatha) cơ bản',           topic_id: 401, topic_name: 'Thiền chỉ (Samatha)',              topic_icon: '🕯️', topic_color: '#10b981', level: 'Cơ bản',    question_count: 10, time_limit: 15 },
  { id: 7, title: 'Thiền quán (Vipassanā) nhập môn',      topic_id: 402, topic_name: 'Thiền quán (Vipassanā)',           topic_icon: '👁️', topic_color: '#10b981', level: 'Trung cấp', question_count: 12, time_limit: 20 },
  { id: 8, title: 'Giới luật tại gia – Ngũ giới',         topic_id: 301, topic_name: 'Tại gia',                          topic_icon: '🏠', topic_color: '#0ea5e9', level: 'Cơ bản',    question_count: 10, time_limit: 15 },
  { id: 9, title: 'Lịch sử Phật giáo Việt Nam',           topic_id: 504, topic_name: 'LS Phật Giáo Việt Nam',            topic_icon: '🇻🇳', topic_color: '#8b5cf6', level: 'Trung cấp', question_count: 12, time_limit: 20 },
  { id: 10, title: 'Cuộc đời Đức Phật Thích Ca',          topic_id: 505, topic_name: 'Cuộc đời Đức Phật Thích Ca',       topic_icon: '⭐', topic_color: '#8b5cf6', level: 'Cơ bản',    question_count: 15, time_limit: 20 },
  { id: 11, title: 'Ngũ uẩn – Phân tích thân tâm',        topic_id: 106, topic_name: 'Ngũ uẩn',                          topic_icon: '⚗️', topic_color: '#D4A017', level: 'Nâng cao',  question_count: 10, time_limit: 20 },
  { id: 12, title: 'Trung Bộ Kinh – Kinh Căn Bản Pháp',  topic_id: 202, topic_name: 'Trung Bộ Kinh (Majjhima Nikāya)', topic_icon: '📜', topic_color: '#E8890B', level: 'Chuyên sâu', question_count: 10, time_limit: 25 },
];

export const mockRecentResults: QuizResult[] = [
  { id: 1, quiz_id: 1,  quiz_title: 'Vô thường – Khổ – Vô ngã cơ bản',    topic_name: 'Vô thường – Khổ – Vô ngã',  level: 'Cơ bản',    score: 90, correct_answers: 9,  total_questions: 10, time_spent: 12, passed: true,  completed_at: '2024-05-18 09:30' },
  { id: 2, quiz_id: 2,  quiz_title: 'Tứ niệm xứ nâng cao',                 topic_name: 'Tứ niệm xứ',                level: 'Trung cấp', score: 85, correct_answers: 13, total_questions: 15, time_spent: 18, passed: true,  completed_at: '2024-05-17 14:20' },
  { id: 3, quiz_id: 3,  quiz_title: 'Luân hồi và Nghiệp báo',              topic_name: 'Luân hồi (Samsara)',         level: 'Trung cấp', score: 78, correct_answers: 9,  total_questions: 12, time_spent: 16, passed: true,  completed_at: '2024-05-16 11:15' },
  { id: 4, quiz_id: 4,  quiz_title: 'Trường Bộ Kinh – Đại kinh',           topic_name: 'Trường Bộ Kinh',             level: 'Nâng cao',  score: 88, correct_answers: 7,  total_questions: 8,  time_spent: 25, passed: true,  completed_at: '2024-05-15 16:45' },
  { id: 5, quiz_id: 6,  quiz_title: 'Thiền chỉ (Samatha) cơ bản',          topic_name: 'Thiền chỉ (Samatha)',        level: 'Cơ bản',    score: 80, correct_answers: 8,  total_questions: 10, time_spent: 14, passed: true,  completed_at: '2024-05-14 09:00' },
];

export const mockLeaderboard: LeaderboardEntry[] = [
  { id: 3, rank: 1, name: 'Tuệ Minh', xp: 960, level_id: 3 },
  { id: 2, rank: 2, name: 'Minh Tâm', xp: 720, level_id: 3, isCurrentUser: true },
  { id: 4, rank: 3, name: 'Pháp Hạnh', xp: 680, level_id: 2 },
  { id: 7, rank: 4, name: 'Từ Bi', xp: 890, level_id: 3 },
  { id: 5, rank: 5, name: 'Diệu Hạnh', xp: 620, level_id: 2 },
];

export const mockQuizQuestions = [
  {
    id: 1,
    question: 'Tứ Diệu Đế là gì?',
    option_a: 'Bốn điều chân thật cao quý',
    option_b: 'Bốn vị thần hộ pháp',
    option_c: 'Bốn loại thiền định',
    option_d: 'Bốn giai đoạn giác ngộ',
    correct_answer: 1,
    explanation: 'Tứ Diệu Đế là bốn sự thật cao quý được Đức Phật giảng dạy: Khổ, Tập, Diệt, Đạo',
  },
  {
    id: 2,
    question: 'Khổ Đế (Dukkha) bao gồm những loại khổ nào?',
    option_a: 'Khổ khổ, Hoại khổ, Hành khổ',
    option_b: 'Sinh khổ, Già khổ, Bệnh khổ',
    option_c: 'Tham, Sân, Si',
    option_d: 'Vô minh, Ái, Thủ',
    correct_answer: 1,
    explanation: 'Khổ Đế bao gồm ba loại: Khổ khổ (dukkha-dukkha), Hoại khổ (viparinama-dukkha), Hành khổ (sankhara-dukkha)',
  },
  {
    id: 3,
    question: 'Nguyên nhân chính của khổ đau theo Tập Đế là gì?',
    option_a: 'Tham ái (taṇhā)',
    option_b: 'Vô minh',
    option_c: 'Nghiệp báo',
    option_d: 'Số phận',
    correct_answer: 1,
    explanation: 'Theo Tập Đế, tham ái (taṇhā) là nguyên nhân chính dẫn đến khổ đau và tái sinh',
  },
  {
    id: 4,
    question: 'Diệt Đế chỉ trạng thái nào?',
    option_a: 'Niết Bàn - sự chấm dứt hoàn toàn tham ái',
    option_b: 'Thiền định sâu',
    option_c: 'Cái chết bình an',
    option_d: 'Trạng thái vô thức',
    correct_answer: 1,
    explanation: 'Diệt Đế (Nirodha) chỉ trạng thái Niết Bàn - sự chấm dứt hoàn toàn tham ái và khổ đau',
  },
  {
    id: 5,
    question: 'Bát Chánh Đạo có bao nhiêu nhánh?',
    option_a: '8',
    option_b: '4',
    option_c: '10',
    option_d: '12',
    correct_answer: 1,
    explanation: 'Bát Chánh Đạo gồm 8 nhánh: Chánh kiến, Chánh tư duy, Chánh ngữ, Chánh nghiệp, Chánh mạng, Chánh tinh tấn, Chánh niệm, Chánh định',
  },
];
