import { User, Badge, Topic, Quiz, QuizResult, LeaderboardEntry, UserStats } from '@/types';

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

export const mockBadges: Badge[] = [
  { id: 1, name: 'Học viên Xuất sắc', description: 'Đạt điểm 90%+ trong 5 bài thi', icon: '🥇', color: '#D4A017' },
  { id: 2, name: 'Chuyên gia Tứ Diệu Đế', description: 'Hoàn thành tất cả bài Tứ Diệu Đế', icon: '🏆', color: '#C0C0C0' },
  { id: 3, name: 'Tinh tấn 7 ngày', description: 'Học liên tục 7 ngày', icon: '🔥', color: '#E8890B' },
  { id: 4, name: 'Kiến thức Toàn diện', description: 'Hoàn thành bài thi ở cả 4 cấp độ', icon: '💎', color: '#0ea5e9' },
  { id: 5, name: 'Sơ tâm', description: 'Hoàn thành bài thi đầu tiên', icon: '🌱', color: '#10b981' },
  { id: 6, name: 'Pháp Hữu', description: 'Tham gia cộng đồng hỏi đáp', icon: '🤝', color: '#8b5cf6' },
];

export const mockTopics: Topic[] = [
  { id: 1, name: 'Tứ Diệu Đế', slug: 'tu-dieu-de', icon: '☸️', color: '#D4A017', question_count: 45 },
  { id: 2, name: 'Bát Chánh Đạo', slug: 'bat-chanh-dao', icon: '🔱', color: '#E8890B', question_count: 60 },
  { id: 3, name: 'Nhân Quả Nghiệp Báo', slug: 'nhan-qua-nghiep-bao', icon: '⚖️', color: '#9333ea', question_count: 50 },
  { id: 4, name: 'Giới Luật', slug: 'gioi-luat', icon: '📿', color: '#0ea5e9', question_count: 40 },
  { id: 5, name: 'Thiền Định', slug: 'thien-dinh', icon: '🧘', color: '#10b981', question_count: 45 },
  { id: 6, name: 'Kinh Điển', slug: 'kinh-dien', icon: '📖', color: '#f97316', question_count: 80 },
  { id: 7, name: 'Lịch Sử Phật Giáo', slug: 'lich-su-phat-giao', icon: '🏛️', color: '#64748b', question_count: 70 },
];

export const mockQuizzes: Quiz[] = [
  { id: 1, title: 'Thi trắc nghiệm Tứ Diệu Đế', topic_id: 1, topic_name: 'Tứ Diệu Đế', topic_icon: '☸️', topic_color: '#D4A017', level: 'Cơ bản', question_count: 10, time_limit: 15 },
  { id: 2, title: 'Thi trắc nghiệm Bát Chánh Đạo', topic_id: 2, topic_name: 'Bát Chánh Đạo', topic_icon: '🔱', topic_color: '#E8890B', level: 'Trung cấp', question_count: 15, time_limit: 20 },
  { id: 3, title: 'Thi trắc nghiệm Nhân Quả', topic_id: 3, topic_name: 'Nhân Quả Nghiệp Báo', topic_icon: '⚖️', topic_color: '#9333ea', level: 'Trung cấp', question_count: 12, time_limit: 18 },
  { id: 4, title: 'Thi tự luận: Ý nghĩa Vô thường', topic_id: 6, topic_name: 'Kinh Điển', topic_icon: '📖', topic_color: '#f97316', level: 'Nâng cao', question_count: 8, time_limit: 30 },
  { id: 5, title: 'Tứ Diệu Đế - Nâng cao', topic_id: 1, topic_name: 'Tứ Diệu Đế', topic_icon: '☸️', topic_color: '#D4A017', level: 'Nâng cao', question_count: 20, time_limit: 25 },
  { id: 6, title: 'Thiền Định cơ bản', topic_id: 5, topic_name: 'Thiền Định', topic_icon: '🧘', topic_color: '#10b981', level: 'Cơ bản', question_count: 10, time_limit: 15 },
];

export const mockRecentResults: QuizResult[] = [
  { id: 1, quiz_id: 1, quiz_title: 'Thi trắc nghiệm Tứ Diệu Đế', topic_name: 'Tứ Diệu Đế', level: 'Cơ bản', score: 90, correct_answers: 9, total_questions: 10, time_spent: 12, passed: true, completed_at: '2024-05-18 09:30' },
  { id: 2, quiz_id: 2, quiz_title: 'Thi trắc nghiệm Bát Chánh Đạo', topic_name: 'Bát Chánh Đạo', level: 'Trung cấp', score: 85, correct_answers: 13, total_questions: 15, time_spent: 18, passed: true, completed_at: '2024-05-17 14:20' },
  { id: 3, quiz_id: 3, quiz_title: 'Thi trắc nghiệm Nhân Quả', topic_name: 'Nhân Quả Nghiệp Báo', level: 'Trung cấp', score: 78, correct_answers: 9, total_questions: 12, time_spent: 16, passed: true, completed_at: '2024-05-16 11:15' },
  { id: 4, quiz_id: 4, quiz_title: 'Thi tự luận: Ý nghĩa Vô thường', topic_name: 'Kinh Điển', level: 'Nâng cao', score: 88, correct_answers: 7, total_questions: 8, time_spent: 25, passed: true, completed_at: '2024-05-15 16:45' },
  { id: 5, quiz_id: 6, quiz_title: 'Thiền Định cơ bản', topic_name: 'Thiền Định', level: 'Cơ bản', score: 80, correct_answers: 8, total_questions: 10, time_spent: 14, passed: true, completed_at: '2024-05-14 09:00' },
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
