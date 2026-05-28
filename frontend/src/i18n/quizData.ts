import { Lang } from './translations';

type LangMap = Record<Lang, string>;

export const topicNames: Record<number, LangMap> = {
  1: { vi: 'Chủ Đề',             'zh-CN': '主题',      'zh-TW': '主題' },
  2: { vi: 'Kinh',               'zh-CN': '经典',      'zh-TW': '經典' },
  3: { vi: 'Giới Luật',          'zh-CN': '戒律',      'zh-TW': '戒律' },
  4: { vi: 'Thiền',              'zh-CN': '禅修',      'zh-TW': '禪修' },
  5: { vi: 'Lịch Sử Phật Giáo', 'zh-CN': '佛教历史',  'zh-TW': '佛教歷史' },
};

export const subTopicNames: Record<number, LangMap> = {
  101: { vi: 'Luân hồi (Samsara)',                   'zh-CN': '轮回 (Samsara)',             'zh-TW': '輪迴 (Samsara)' },
  102: { vi: 'Niết-bàn (Nibbāna)',                   'zh-CN': '涅槃 (Nibbāna)',             'zh-TW': '涅槃 (Nibbāna)' },
  103: { vi: 'Tam bảo: Phật – Pháp – Tăng',         'zh-CN': '三宝：佛–法–僧',             'zh-TW': '三寶：佛–法–僧' },
  104: { vi: 'Thập thiện nghiệp',                    'zh-CN': '十善业',                     'zh-TW': '十善業' },
  105: { vi: 'Tứ niệm xứ',                           'zh-CN': '四念处',                     'zh-TW': '四念處' },
  106: { vi: 'Ngũ uẩn (sắc, thọ, tưởng, hành, thức)', 'zh-CN': '五蕴（色、受、想、行、识）', 'zh-TW': '五蘊（色、受、想、行、識）' },
  107: { vi: 'Thập nhị nhân duyên',                  'zh-CN': '十二因缘',                   'zh-TW': '十二因緣' },
  108: { vi: 'Vô thường – Khổ – Vô ngã',             'zh-CN': '无常–苦–无我',               'zh-TW': '無常–苦–無我' },
  201: { vi: 'Trường Bộ Kinh (Dīgha Nikāya)',        'zh-CN': '长部经典 (Dīgha Nikāya)',    'zh-TW': '長部經典 (Dīgha Nikāya)' },
  202: { vi: 'Trung Bộ Kinh (Majjhima Nikāya)',      'zh-CN': '中部经典 (Majjhima Nikāya)', 'zh-TW': '中部經典 (Majjhima Nikāya)' },
  203: { vi: 'Tương Ưng Bộ Kinh (Saṃyutta Nikāya)', 'zh-CN': '相应部经典 (Saṃyutta Nikāya)', 'zh-TW': '相應部經典 (Saṃyutta Nikāya)' },
  204: { vi: 'Tăng Chi Bộ Kinh (Aṅguttara Nikāya)', 'zh-CN': '增支部经典 (Aṅguttara Nikāya)', 'zh-TW': '增支部經典 (Aṅguttara Nikāya)' },
  205: { vi: 'Tiểu Bộ Kinh (Khuddaka Nikāya)',       'zh-CN': '小部经典 (Khuddaka Nikāya)', 'zh-TW': '小部經典 (Khuddaka Nikāya)' },
  206: { vi: 'Trường A hàm (Dīrgha Āgama)',          'zh-CN': '长阿含 (Dīrgha Āgama)',      'zh-TW': '長阿含 (Dīrgha Āgama)' },
  207: { vi: 'Trung A hàm (Madhyama Āgama)',         'zh-CN': '中阿含 (Madhyama Āgama)',    'zh-TW': '中阿含 (Madhyama Āgama)' },
  208: { vi: 'Tạp A hàm (Saṃyukta Āgama)',           'zh-CN': '杂阿含 (Saṃyukta Āgama)',   'zh-TW': '雜阿含 (Saṃyukta Āgama)' },
  209: { vi: 'Tăng nhất A hàm (Ekottara Āgama)',     'zh-CN': '增一阿含 (Ekottara Āgama)', 'zh-TW': '增一阿含 (Ekottara Āgama)' },
  301: { vi: 'Tại gia',         'zh-CN': '在家众',    'zh-TW': '在家眾' },
  302: { vi: 'Sa di',           'zh-CN': '沙弥',      'zh-TW': '沙彌' },
  303: { vi: 'Tỳ kheo',         'zh-CN': '比丘',      'zh-TW': '比丘' },
  304: { vi: 'Sa di ni',        'zh-CN': '沙弥尼',    'zh-TW': '沙彌尼' },
  305: { vi: 'Thức xoa ma na',  'zh-CN': '式叉摩那',  'zh-TW': '式叉摩那' },
  306: { vi: 'Tỳ kheo ni',      'zh-CN': '比丘尼',   'zh-TW': '比丘尼' },
  401: { vi: 'Thiền chỉ (Samatha)',   'zh-CN': '止禅 (Samatha)',   'zh-TW': '止禪 (Samatha)' },
  402: { vi: 'Thiền quán (Vipassanā)', 'zh-CN': '观禅 (Vipassanā)', 'zh-TW': '觀禪 (Vipassanā)' },
  501: { vi: 'LS Phật Giáo Ấn Độ',          'zh-CN': '印度佛教史',      'zh-TW': '印度佛教史' },
  502: { vi: 'LS Phật Giáo Sri Lanka',       'zh-CN': '斯里兰卡佛教史',  'zh-TW': '斯里蘭卡佛教史' },
  503: { vi: 'LS Phật Giáo Trung Quốc',      'zh-CN': '中国佛教史',      'zh-TW': '中國佛教史' },
  504: { vi: 'LS Phật Giáo Việt Nam',         'zh-CN': '越南佛教史',      'zh-TW': '越南佛教史' },
  505: { vi: 'Cuộc đời Đức Phật Thích Ca',   'zh-CN': '释迦牟尼佛的一生', 'zh-TW': '釋迦牟尼佛的一生' },
};

export const quizTitles: Record<number, LangMap> = {
  1:  { vi: 'Vô thường – Khổ – Vô ngã cơ bản',    'zh-CN': '无常–苦–无我基础',        'zh-TW': '無常–苦–無我基礎' },
  2:  { vi: 'Tứ niệm xứ nâng cao',                  'zh-CN': '四念处进阶',              'zh-TW': '四念處進階' },
  3:  { vi: 'Luân hồi và Nghiệp báo',               'zh-CN': '轮回与业报',              'zh-TW': '輪迴與業報' },
  4:  { vi: 'Trường Bộ Kinh – Đại kinh',            'zh-CN': '长部经典–大经',           'zh-TW': '長部經典–大經' },
  5:  { vi: 'Thập nhị nhân duyên chuyên sâu',       'zh-CN': '十二因缘深度解析',        'zh-TW': '十二因緣深度解析' },
  6:  { vi: 'Thiền chỉ (Samatha) cơ bản',           'zh-CN': '止禅 (Samatha) 基础',    'zh-TW': '止禪 (Samatha) 基礎' },
  7:  { vi: 'Thiền quán (Vipassanā) nhập môn',      'zh-CN': '观禅 (Vipassanā) 入门',  'zh-TW': '觀禪 (Vipassanā) 入門' },
  8:  { vi: 'Giới luật tại gia – Ngũ giới',         'zh-CN': '居家戒律–五戒',           'zh-TW': '居家戒律–五戒' },
  9:  { vi: 'Lịch sử Phật giáo Việt Nam',           'zh-CN': '越南佛教史',              'zh-TW': '越南佛教史' },
  10: { vi: 'Cuộc đời Đức Phật Thích Ca',           'zh-CN': '释迦牟尼佛的一生',        'zh-TW': '釋迦牟尼佛的一生' },
  11: { vi: 'Ngũ uẩn – Phân tích thân tâm',         'zh-CN': '五蕴–身心分析',          'zh-TW': '五蘊–身心分析' },
  12: { vi: 'Trung Bộ Kinh – Kinh Căn Bản Pháp',   'zh-CN': '中部经典–法义根本经',     'zh-TW': '中部經典–法義根本經' },
};

// Vietnamese level name → translated display name
export const levelNameMap: Record<string, LangMap> = {
  'Cơ bản':    { vi: 'Cơ bản',    'zh-CN': '基础', 'zh-TW': '基礎' },
  'Trung cấp': { vi: 'Trung cấp', 'zh-CN': '中级', 'zh-TW': '中級' },
  'Nâng cao':  { vi: 'Nâng cao',  'zh-CN': '进阶', 'zh-TW': '進階' },
  'Chuyên sâu':{ vi: 'Chuyên sâu','zh-CN': '专研', 'zh-TW': '專研' },
};

// Level descriptions by level id (1-4)
export const levelDescMap: Record<number, LangMap> = {
  1: { vi: 'Dành cho người mới bắt đầu tìm hiểu giáo lý Phật đà', 'zh-CN': '适合初次学习佛陀教义的人', 'zh-TW': '適合初次學習佛陀教義的人' },
  2: { vi: 'Kiến thức Phật pháp căn bản — Tứ Diệu Đế, Bát Chánh Đạo', 'zh-CN': '佛法基础知识 — 四圣谛、八正道', 'zh-TW': '佛法基礎知識 — 四聖諦、八正道' },
  3: { vi: 'Phật pháp chuyên sâu — Luận tạng, Thiền định, Mật tông', 'zh-CN': '深入佛法 — 论藏、禅定、密宗', 'zh-TW': '深入佛法 — 論藏、禪定、密宗' },
  4: { vi: 'Học thuật & nghiên cứu — Tam tạng kinh điển', 'zh-CN': '学术研究 — 三藏经典', 'zh-TW': '學術研究 — 三藏經典' },
};

// XP level names by level_id (1-6)
export const xpLevelNames: Record<number, LangMap> = {
  1: { vi: 'Sơ tâm',     'zh-CN': '初心',   'zh-TW': '初心' },
  2: { vi: 'Trung cấp 1','zh-CN': '中级一', 'zh-TW': '中級一' },
  3: { vi: 'Trung cấp 2','zh-CN': '中级二', 'zh-TW': '中級二' },
  4: { vi: 'Nâng cao 1', 'zh-CN': '进阶一', 'zh-TW': '進階一' },
  5: { vi: 'Nâng cao 2', 'zh-CN': '进阶二', 'zh-TW': '進階二' },
  6: { vi: 'Chuyên gia', 'zh-CN': '专家',   'zh-TW': '專家' },
};

// Badge translations by badge id
export const badgeTranslations: Record<number, { name: LangMap; description: LangMap }> = {
  1: {
    name:        { vi: 'Học viên Xuất sắc',      'zh-CN': '优秀学员',      'zh-TW': '優秀學員' },
    description: { vi: 'Đạt điểm 90%+ trong 5 bài thi', 'zh-CN': '在5次考试中获得90%+分数', 'zh-TW': '在5次考試中獲得90%+分數' },
  },
  2: {
    name:        { vi: 'Chuyên gia Tứ Diệu Đế',  'zh-CN': '四圣谛专家',    'zh-TW': '四聖諦專家' },
    description: { vi: 'Hoàn thành tất cả bài Tứ Diệu Đế', 'zh-CN': '完成所有四圣谛课程', 'zh-TW': '完成所有四聖諦課程' },
  },
  3: {
    name:        { vi: 'Tinh tấn 7 ngày',         'zh-CN': '七日精进',      'zh-TW': '七日精進' },
    description: { vi: 'Học liên tục 7 ngày',     'zh-CN': '连续学习7天',  'zh-TW': '連續學習7天' },
  },
  4: {
    name:        { vi: 'Kiến thức Toàn diện',     'zh-CN': '全面知识',      'zh-TW': '全面知識' },
    description: { vi: 'Hoàn thành bài thi ở cả 4 cấp độ', 'zh-CN': '完成所有4个级别的考试', 'zh-TW': '完成所有4個級別的考試' },
  },
  5: {
    name:        { vi: 'Sơ tâm',                  'zh-CN': '初心',          'zh-TW': '初心' },
    description: { vi: 'Hoàn thành bài thi đầu tiên', 'zh-CN': '完成第一次考试', 'zh-TW': '完成第一次考試' },
  },
  6: {
    name:        { vi: 'Pháp Hữu',                'zh-CN': '法友',          'zh-TW': '法友' },
    description: { vi: 'Tham gia cộng đồng hỏi đáp', 'zh-CN': '参与问答社区', 'zh-TW': '參與問答社區' },
  },
};

// Question translations by question id
export const questionData: Array<{
  id: number;
  correct_answer: number;
  vi:     { question: string; option_a: string; option_b: string; option_c: string; option_d: string; explanation: string };
  'zh-CN':{ question: string; option_a: string; option_b: string; option_c: string; option_d: string; explanation: string };
  'zh-TW':{ question: string; option_a: string; option_b: string; option_c: string; option_d: string; explanation: string };
}> = [
  {
    id: 1,
    correct_answer: 1,
    vi: {
      question:    'Tứ Diệu Đế là gì?',
      option_a:    'Bốn điều chân thật cao quý',
      option_b:    'Bốn vị thần hộ pháp',
      option_c:    'Bốn loại thiền định',
      option_d:    'Bốn giai đoạn giác ngộ',
      explanation: 'Tứ Diệu Đế là bốn sự thật cao quý được Đức Phật giảng dạy: Khổ, Tập, Diệt, Đạo',
    },
    'zh-CN': {
      question:    '四圣谛是什么？',
      option_a:    '四种崇高的真理',
      option_b:    '四位护法神',
      option_c:    '四种禅定',
      option_d:    '四个觉悟阶段',
      explanation: '四圣谛是佛陀所教导的四种崇高真理：苦、集、灭、道',
    },
    'zh-TW': {
      question:    '四聖諦是什麼？',
      option_a:    '四種崇高的真理',
      option_b:    '四位護法神',
      option_c:    '四種禪定',
      option_d:    '四個覺悟階段',
      explanation: '四聖諦是佛陀所教導的四種崇高真理：苦、集、滅、道',
    },
  },
  {
    id: 2,
    correct_answer: 1,
    vi: {
      question:    'Khổ Đế (Dukkha) bao gồm những loại khổ nào?',
      option_a:    'Khổ khổ, Hoại khổ, Hành khổ',
      option_b:    'Sinh khổ, Già khổ, Bệnh khổ',
      option_c:    'Tham, Sân, Si',
      option_d:    'Vô minh, Ái, Thủ',
      explanation: 'Khổ Đế bao gồm ba loại: Khổ khổ (dukkha-dukkha), Hoại khổ (viparinama-dukkha), Hành khổ (sankhara-dukkha)',
    },
    'zh-CN': {
      question:    '苦谛（Dukkha）包含哪些种类的苦？',
      option_a:    '苦苦、坏苦、行苦',
      option_b:    '生苦、老苦、病苦',
      option_c:    '贪、嗔、痴',
      option_d:    '无明、爱、取',
      explanation: '苦谛包含三种：苦苦（dukkha-dukkha）、坏苦（viparinama-dukkha）、行苦（sankhara-dukkha）',
    },
    'zh-TW': {
      question:    '苦諦（Dukkha）包含哪些種類的苦？',
      option_a:    '苦苦、壞苦、行苦',
      option_b:    '生苦、老苦、病苦',
      option_c:    '貪、嗔、痴',
      option_d:    '無明、愛、取',
      explanation: '苦諦包含三種：苦苦（dukkha-dukkha）、壞苦（viparinama-dukkha）、行苦（sankhara-dukkha）',
    },
  },
  {
    id: 3,
    correct_answer: 1,
    vi: {
      question:    'Nguyên nhân chính của khổ đau theo Tập Đế là gì?',
      option_a:    'Tham ái (taṇhā)',
      option_b:    'Vô minh',
      option_c:    'Nghiệp báo',
      option_d:    'Số phận',
      explanation: 'Theo Tập Đế, tham ái (taṇhā) là nguyên nhân chính dẫn đến khổ đau và tái sinh',
    },
    'zh-CN': {
      question:    '根据集谛，苦的主要原因是什么？',
      option_a:    '贪爱（taṇhā）',
      option_b:    '无明',
      option_c:    '业报',
      option_d:    '命运',
      explanation: '根据集谛，贪爱（taṇhā）是导致苦和再生的主要原因',
    },
    'zh-TW': {
      question:    '根據集諦，苦的主要原因是什麼？',
      option_a:    '貪愛（taṇhā）',
      option_b:    '無明',
      option_c:    '業報',
      option_d:    '命運',
      explanation: '根據集諦，貪愛（taṇhā）是導致苦和再生的主要原因',
    },
  },
  {
    id: 4,
    correct_answer: 1,
    vi: {
      question:    'Diệt Đế chỉ trạng thái nào?',
      option_a:    'Niết Bàn - sự chấm dứt hoàn toàn tham ái',
      option_b:    'Thiền định sâu',
      option_c:    'Cái chết bình an',
      option_d:    'Trạng thái vô thức',
      explanation: 'Diệt Đế (Nirodha) chỉ trạng thái Niết Bàn - sự chấm dứt hoàn toàn tham ái và khổ đau',
    },
    'zh-CN': {
      question:    '灭谛指什么状态？',
      option_a:    '涅槃——贪爱的彻底息灭',
      option_b:    '深度禅定',
      option_c:    '安详的死亡',
      option_d:    '无意识状态',
      explanation: '灭谛（Nirodha）指涅槃状态——贪爱和苦的彻底息灭',
    },
    'zh-TW': {
      question:    '滅諦指什麼狀態？',
      option_a:    '涅槃——貪愛的徹底息滅',
      option_b:    '深度禪定',
      option_c:    '安詳的死亡',
      option_d:    '無意識狀態',
      explanation: '滅諦（Nirodha）指涅槃狀態——貪愛和苦的徹底息滅',
    },
  },
  {
    id: 5,
    correct_answer: 1,
    vi: {
      question:    'Bát Chánh Đạo có bao nhiêu nhánh?',
      option_a:    '8',
      option_b:    '4',
      option_c:    '10',
      option_d:    '12',
      explanation: 'Bát Chánh Đạo gồm 8 nhánh: Chánh kiến, Chánh tư duy, Chánh ngữ, Chánh nghiệp, Chánh mạng, Chánh tinh tấn, Chánh niệm, Chánh định',
    },
    'zh-CN': {
      question:    '八正道有多少个支？',
      option_a:    '8',
      option_b:    '4',
      option_c:    '10',
      option_d:    '12',
      explanation: '八正道包含8个支：正见、正思维、正语、正业、正命、正精进、正念、正定',
    },
    'zh-TW': {
      question:    '八正道有多少個支？',
      option_a:    '8',
      option_b:    '4',
      option_c:    '10',
      option_d:    '12',
      explanation: '八正道包含8個支：正見、正思維、正語、正業、正命、正精進、正念、正定',
    },
  },
];
