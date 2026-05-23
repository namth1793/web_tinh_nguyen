'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Search, ThumbsUp, ChevronDown, ChevronUp, Plus, Send, X } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/ThemeContext';

const CATEGORIES = ['Tất cả', 'Tứ Diệu Đế', 'Thiền Định', 'Nhân Quả', 'Giới Luật', 'Kinh Điển', 'Khác'];

const mockQA = [
  {
    id: 1, category: 'Tứ Diệu Đế',
    question: 'Tứ Diệu Đế khác gì với Bát Chánh Đạo?',
    author: 'Minh Tâm', avatar: '🧘', time: '2 giờ trước', likes: 24,
    answer: 'Tứ Diệu Đế là bốn sự thật cao quý (Khổ, Tập, Diệt, Đạo) — đây là bản đồ chỉ ra bản chất của khổ đau và con đường thoát khổ. Còn Bát Chánh Đạo chính là nội dung chi tiết của "Đạo Đế" (chân lý thứ 4), gồm 8 nhánh thực hành cụ thể: Chánh kiến, Chánh tư duy, Chánh ngữ, Chánh nghiệp, Chánh mạng, Chánh tinh tấn, Chánh niệm, Chánh định. Tóm lại, Tứ Diệu Đế là khung lý thuyết, còn Bát Chánh Đạo là con đường thực hành nằm trong Đạo Đế.',
    answerer: 'Pháp Hạnh', answererAvatar: '📿', replies: 3,
  },
  {
    id: 2, category: 'Thiền Định',
    question: 'Người mới bắt đầu nên học thiền theo phương pháp nào?',
    author: 'Tuệ Minh', avatar: '🌿', time: '5 giờ trước', likes: 18,
    answer: 'Người mới nên bắt đầu với Thiền Chỉ (Samatha) — cụ thể là kỹ thuật theo dõi hơi thở (Anapanasati). Ngồi yên, lưng thẳng, mắt nhắm nhẹ, đặt sự chú ý hoàn toàn vào hơi thở vào-ra tại đầu mũi. Khi tâm bị phân tán, nhẹ nhàng đưa sự chú ý trở về hơi thở — không phán xét, không bực bội. Bắt đầu 10-15 phút mỗi ngày, duy trì đều đặn quan trọng hơn thời gian dài. Sau khi ổn định, có thể chuyển sang Thiền Quán (Vipassana).',
    answerer: 'Admin', answererAvatar: '⚡', replies: 7,
  },
  {
    id: 3, category: 'Nhân Quả',
    question: 'Nghiệp tốt trong kiếp này có ảnh hưởng đến kiếp sau không?',
    author: 'Diệu Hạnh', avatar: '🪷', time: '1 ngày trước', likes: 31,
    answer: 'Theo giáo lý Phật giáo, nghiệp (karma) là năng lực của hành động có ý chí (cetanā). Nghiệp được tạo trong kiếp này sẽ tiếp tục theo dòng tâm thức (vijñāna-santāna) sang các kiếp sau. Nghiệp thiện (hành động từ bi, trí tuệ, bố thí...) tạo ra quả lành: tái sinh vào hoàn cảnh thuận lợi, có trí tuệ, sức khỏe tốt. Nghiệp không phải "số phận cố định" mà là xu hướng — người có định lực có thể chuyển hóa nghiệp thông qua tu tập.',
    answerer: 'Tuệ Minh', answererAvatar: '🌿', replies: 5,
  },
  {
    id: 4, category: 'Giới Luật',
    question: 'Ngũ giới có bắt buộc với mọi Phật tử không?',
    author: 'Tâm Bình', avatar: '☸️', time: '2 ngày trước', likes: 15,
    answer: 'Ngũ giới (không sát sinh, không trộm cắp, không tà dâm, không nói dối, không dùng chất say) là nền tảng đạo đức cơ bản dành cho tất cả Phật tử tại gia khi quy y Tam Bảo. Đây không phải là mệnh lệnh bắt buộc mà là cam kết tự nguyện — xuất phát từ sự hiểu biết rằng giữ giới giúp tâm thanh tịnh, giảm thiểu tạo nghiệp xấu và tạo nền tảng cho thiền định phát triển.',
    answerer: 'Pháp Hạnh', answererAvatar: '📿', replies: 2,
  },
  {
    id: 5, category: 'Kinh Điển',
    question: 'Nên bắt đầu đọc kinh nào cho người mới học Phật?',
    author: 'Từ Bi', avatar: '🏛️', time: '3 ngày trước', likes: 42,
    answer: 'Cho người mới, tôi gợi ý theo thứ tự: (1) Kinh Pháp Cú (Dhammapada) — 423 kệ ngắn gọn, súc tích, dễ hiểu; (2) Kinh Nhật Tụng (các bài kinh ngắn thường dùng); (3) Kinh Di Giáo — lời dạy cuối của Đức Phật; (4) Kinh Bốn Lãnh Vực Quán Niệm (Satipatthana Sutta). Tránh bắt đầu với kinh dài như A Hàm hay Đại Bát Niết Bàn vì rất khó nếu chưa có nền tảng.',
    answerer: 'Admin', answererAvatar: '⚡', replies: 12,
  },
];

export default function QAPage() {
  const { user } = useApp();
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [showAskForm, setShowAskForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [likedIds, setLikedIds] = useState<number[]>([]);

  const filtered = mockQA.filter((q) => {
    if (activeCategory !== 'Tất cả' && q.category !== activeCategory) return false;
    if (search && !q.question.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleLike = (id: number) => {
    setLikedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  return (
    <MainLayout showRightSidebar={false}>
      <div className="max-w-3xl page-enter">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-temple-dark dark:text-cream-100 flex items-center gap-2">
              <MessageCircle className="text-gold-500" size={26} />
              Hỏi đáp Phật pháp
            </h1>
            <p className="text-sm text-temple-medium mt-1">Cộng đồng cùng học hỏi và chia sẻ Phật pháp</p>
          </div>
          {user && (
            <button
              onClick={() => setShowAskForm(!showAskForm)}
              className="flex items-center gap-2 btn-gold text-sm py-2 px-4"
            >
              <Plus size={16} /> Đặt câu hỏi
            </button>
          )}
        </div>

        {/* Ask form */}
        <AnimatePresence>
          {showAskForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="card p-5 mb-5">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-temple-dark dark:text-cream-100">Câu hỏi của bạn</h3>
                  <button onClick={() => setShowAskForm(false)}><X size={18} className="text-temple-medium" /></button>
                </div>
                <textarea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Nhập câu hỏi về Phật pháp của bạn tại đây... Hãy đặt câu hỏi cụ thể và rõ ràng để nhận được câu trả lời chính xác nhất."
                  rows={4}
                  className="w-full p-3 rounded-xl border-2 border-cream-200 dark:border-[#3A2A10] bg-cream-50 dark:bg-[#1A1208] text-sm text-temple-dark dark:text-cream-100 placeholder-temple-medium/60 focus:outline-none focus:border-gold-400 resize-none"
                />
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-temple-medium">{newQuestion.length}/500 ký tự</span>
                  <button className="flex items-center gap-2 btn-gold text-sm py-2 px-4" disabled={!newQuestion.trim()}>
                    <Send size={14} /> Gửi câu hỏi
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-temple-medium" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm câu hỏi..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-cream-200 dark:border-[#3A2A10] bg-white dark:bg-[#251C0E] text-sm text-temple-dark dark:text-cream-100 focus:outline-none focus:border-gold-400 transition-all"
          />
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap mb-5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                activeCategory === cat
                  ? 'bg-gold-500 text-white shadow-gold'
                  : 'bg-cream-100 dark:bg-[#3A2A10] text-temple-medium hover:text-temple-dark dark:hover:text-cream-100'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-5">
          <span className="text-sm text-temple-medium">{filtered.length} câu hỏi</span>
          <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Cộng đồng đang hoạt động
          </div>
        </div>

        {/* Q&A list */}
        <div className="space-y-3">
          {filtered.map((item, i) => {
            const isExpanded = expandedId === item.id;
            const isLiked = likedIds.includes(item.id);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="card overflow-hidden"
              >
                {/* Question header */}
                <button
                  className="w-full text-left p-5"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-0.5 flex-shrink-0">{item.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-sm text-temple-dark dark:text-cream-100">{item.author}</span>
                        <span className="text-xs text-temple-medium">{item.time}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-400">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-temple-dark dark:text-cream-100 leading-snug">{item.question}</p>
                    </div>
                    <div className="flex-shrink-0 text-temple-medium">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>

                  {/* Meta bar */}
                  <div className="flex items-center gap-4 mt-3 ml-11">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }}
                      className={cn('flex items-center gap-1.5 text-xs font-medium transition-colors', isLiked ? 'text-gold-500' : 'text-temple-medium hover:text-gold-500')}
                    >
                      <ThumbsUp size={13} fill={isLiked ? 'currentColor' : 'none'} />
                      {item.likes + (isLiked ? 1 : 0)} lượt thích
                    </button>
                    <span className="flex items-center gap-1.5 text-xs text-temple-medium">
                      <MessageCircle size={13} /> {item.replies} trả lời
                    </span>
                  </div>
                </button>

                {/* Answer (expanded) */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-cream-100 dark:border-[#3A2A10] mx-5" />
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xl">{item.answererAvatar}</span>
                          <span className="text-sm font-bold text-gold-600 dark:text-gold-400">{item.answerer}</span>
                          <span className="text-xs bg-gold-100 dark:bg-gold-900/30 text-gold-600 px-2 py-0.5 rounded-full">Giải đáp</span>
                        </div>
                        <div className="bg-cream-50 dark:bg-[#3A2A10] rounded-xl p-4">
                          <p className="text-sm text-temple-dark dark:text-cream-100 leading-relaxed">{item.answer}</p>
                        </div>

                        {/* Reply input */}
                        {user && (
                          <div className="flex gap-2 mt-3">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold-300 to-orange-300 flex items-center justify-center text-sm font-bold text-white flex-shrink-0 mt-1">
                              {user.name.charAt(0)}
                            </div>
                            <div className="flex-1 flex gap-2">
                              <input
                                placeholder="Thêm bình luận..."
                                className="flex-1 px-3 py-2 rounded-xl border border-cream-200 dark:border-[#3A2A10] bg-white dark:bg-[#251C0E] text-xs text-temple-dark dark:text-cream-100 focus:outline-none focus:border-gold-400"
                              />
                              <button className="px-3 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-xl transition-colors">
                                <Send size={13} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="font-semibold text-temple-dark dark:text-cream-100 mb-1">Không tìm thấy câu hỏi</h3>
            <p className="text-sm text-temple-medium">Hãy là người đầu tiên đặt câu hỏi này!</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
