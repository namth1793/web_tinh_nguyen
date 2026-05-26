'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp, BookOpen, Award, BarChart2, Crown, Play } from 'lucide-react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { useLang } from '@/context/LangContext';
import { cn } from '@/lib/utils';

const STEPS = [
  {
    icon: '1️⃣', title: 'Tạo tài khoản', color: 'bg-blue-100 dark:bg-blue-900/20 border-blue-200',
    desc: 'Đăng ký miễn phí với email. Tài khoản giúp lưu tiến độ, nhận XP và huy hiệu.',
    action: { label: 'Đăng ký ngay', href: '/register' },
  },
  {
    icon: '2️⃣', title: 'Chọn trình độ', color: 'bg-green-100 dark:bg-green-900/20 border-green-200',
    desc: 'Bắt đầu từ "Cơ bản" nếu bạn mới học Phật. Có 4 cấp: Cơ bản → Trung cấp → Nâng cao → Chuyên sâu.',
    action: { label: 'Xem các trình độ', href: '/quiz?view=level' },
  },
  {
    icon: '3️⃣', title: 'Làm bài thi', color: 'bg-gold-100 dark:bg-gold-900/20 border-gold-200',
    desc: 'Mỗi bài thi 10-25 câu, có đồng hồ đếm ngược. Sau mỗi câu sẽ có giải thích chi tiết.',
    action: { label: 'Làm bài ngay', href: '/quiz' },
  },
  {
    icon: '4️⃣', title: 'Tích lũy XP & huy hiệu', color: 'bg-purple-100 dark:bg-purple-900/20 border-purple-200',
    desc: 'Mỗi bài thi hoàn thành sẽ nhận XP. Tích lũy đủ XP để lên cấp và nhận huy hiệu đặc biệt.',
    action: { label: 'Xem huy hiệu', href: '/profile?tab=badges' },
  },
];

const FAQS = [
  {
    q: 'Điểm đạt của mỗi bài thi là bao nhiêu?',
    a: 'Ngưỡng đạt là 60% trở lên. Ví dụ bài 10 câu cần đúng ít nhất 6 câu. Điểm càng cao, XP nhận được càng nhiều.',
  },
  {
    q: 'XP và hệ thống cấp độ hoạt động như thế nào?',
    a: 'Mỗi bài thi bạn nhận XP theo công thức: (Điểm × 0.5) + (Đạt ? 20 : 5). Khi tích lũy đủ XP, bạn sẽ tự động lên cấp từ Sơ tâm → Trung cấp 1 → Trung cấp 2 → Nâng cao 1 → Nâng cao 2 → Chuyên gia.',
  },
  {
    q: 'Tôi có thể làm lại bài thi không?',
    a: 'Có! Bạn có thể làm lại bất kỳ bài thi nào không giới hạn số lần. Mỗi lần làm lại đều nhận XP và ghi lại kết quả vào lịch sử.',
  },
  {
    q: 'Huy hiệu được cấp theo điều kiện nào?',
    a: 'Mỗi huy hiệu có điều kiện riêng: "Sơ tâm" — hoàn thành bài thi đầu tiên; "Tinh tấn 7 ngày" — học liên tục 7 ngày; "Học viên Xuất sắc" — đạt 90%+ trong 5 bài thi; "Kiến thức Toàn diện" — hoàn thành bài thi ở cả 4 cấp độ...',
  },
  {
    q: 'Nội dung câu hỏi dựa trên nguồn nào?',
    a: 'Toàn bộ câu hỏi được biên soạn từ Kinh tạng Pali (Tipitaka), Kinh A Hàm, và các tài liệu giảng dạy Phật pháp uy tín. Đội ngũ có cố vấn là những người tu học Phật pháp lâu năm.',
  },
  {
    q: 'Trang web có thu phí không?',
    a: 'Hoàn toàn miễn phí! Phật Pháp Test được xây dựng vì tâm nguyện hoằng pháp, không thu bất kỳ phí nào và không có quảng cáo.',
  },
  {
    q: 'Làm sao để đặt câu hỏi về Phật pháp?',
    a: 'Vào trang "Hỏi đáp Phật pháp" → click nút "Đặt câu hỏi" → nhập câu hỏi và gửi. Cộng đồng và đội ngũ sẽ giải đáp sớm nhất.',
  },
  {
    q: 'Tôi quên mật khẩu thì làm thế nào?',
    a: 'Tại trang đăng nhập, click "Quên mật khẩu?" → nhập email → kiểm tra hộp thư và làm theo hướng dẫn đặt lại mật khẩu.',
  },
];

const FEATURES = [
  { icon: BookOpen, label: 'Ngân hàng đề thi', desc: '500+ câu hỏi, 7 chủ đề', href: '/quiz' },
  { icon: BarChart2, label: 'Thi theo trình độ', desc: '4 cấp độ từ cơ bản đến chuyên sâu', href: '/quiz?view=level' },
  { icon: Award, label: 'Huy hiệu & XP', desc: 'Hệ thống gamification thú vị', href: '/profile?tab=badges' },
  { icon: Crown, label: 'Bảng xếp hạng', desc: 'Thi đua cùng cộng đồng', href: '/ranking' },
];

export default function GuidePage() {
  const { t } = useLang();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <MainLayout showRightSidebar={false}>
      <div className="max-w-3xl page-enter">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-6xl mb-4"
          >
            📚
          </motion.div>
          <h1 className="text-2xl font-black text-temple-dark dark:text-cream-100 mb-2">{t.guide.title}</h1>
          <p className="text-temple-medium text-sm">{t.guide.subtitle}</p>
        </div>

        {/* Quick features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={f.href}>
                <div className="card p-4 text-center cursor-pointer hover:shadow-gold hover:border-gold-200 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-gold-50 dark:bg-gold-900/20 flex items-center justify-center mx-auto mb-2 group-hover:bg-gold-100 transition-colors">
                    <f.icon size={18} className="text-gold-500" />
                  </div>
                  <p className="text-xs font-bold text-temple-dark dark:text-cream-100">{f.label}</p>
                  <p className="text-[10px] text-temple-medium mt-0.5">{f.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Steps */}
        <div className="mb-10">
          <h2 className="text-xl font-black text-temple-dark dark:text-cream-100 mb-5 flex items-center gap-2">
            <Play size={20} className="text-gold-500" /> {t.guide.howToStart}
          </h2>
          <div className="space-y-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className={cn('card p-5 border-l-4', step.color)}
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl flex-shrink-0">{step.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-temple-dark dark:text-cream-100 mb-1">{step.title}</h3>
                    <p className="text-sm text-temple-medium leading-relaxed mb-3">{step.desc}</p>
                    <Link href={step.action.href}>
                      <button className="text-xs font-semibold text-gold-600 hover:text-gold-700 flex items-center gap-1 transition-colors">
                        {step.action.label} →
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* XP Table */}
        <div className="card p-6 mb-10">
          <h2 className="text-lg font-black text-temple-dark dark:text-cream-100 mb-4">{t.guide.xpTable}</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cream-200 dark:border-[#3A2A10]">
                  {['Cấp độ', 'Tên', 'XP cần thiết', 'Mô tả'].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-temple-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { level: 1, name: 'Sơ tâm', xp: '0 – 200', desc: 'Người mới bắt đầu' },
                  { level: 2, name: 'Trung cấp 1', xp: '200 – 500', desc: 'Hiểu các khái niệm cơ bản' },
                  { level: 3, name: 'Trung cấp 2', xp: '500 – 1,000', desc: 'Nắm vững giáo lý căn bản' },
                  { level: 4, name: 'Nâng cao 1', xp: '1,000 – 2,000', desc: 'Kiến thức Phật pháp chuyên sâu' },
                  { level: 5, name: 'Nâng cao 2', xp: '2,000 – 3,500', desc: 'Nghiên cứu kinh điển' },
                  { level: 6, name: 'Chuyên gia', xp: '3,500+', desc: 'Bậc học giả Phật pháp' },
                ].map((row) => (
                  <tr key={row.level} className="border-b border-cream-100 dark:border-[#3A2A10] last:border-0 hover:bg-cream-50 dark:hover:bg-[#3A2A10]/50">
                    <td className="px-3 py-2.5 font-bold text-gold-500">Lv.{row.level}</td>
                    <td className="px-3 py-2.5 font-semibold text-temple-dark dark:text-cream-100">{row.name}</td>
                    <td className="px-3 py-2.5 text-temple-medium">{row.xp} XP</td>
                    <td className="px-3 py-2.5 text-temple-medium">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-8">
          <h2 className="text-xl font-black text-temple-dark dark:text-cream-100 mb-5 flex items-center gap-2">
            <HelpCircle size={22} className="text-gold-500" /> {t.guide.faq}
          </h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="card overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between p-4 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-sm text-temple-dark dark:text-cream-100 pr-4">{faq.q}</span>
                  <div className="flex-shrink-0 text-temple-medium">
                    {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4">
                        <div className="bg-cream-50 dark:bg-[#3A2A10] rounded-xl p-4">
                          <p className="text-sm text-temple-dark dark:text-cream-200 leading-relaxed">{faq.a}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6 text-center border-gold-200 dark:border-gold-800 bg-gold-50/50 dark:bg-gold-900/10"
        >
          <p className="font-bold text-temple-dark dark:text-cream-100 mb-1">{t.guide.stillQuestion}</p>
          <p className="text-sm text-temple-medium mb-4">{t.guide.contactDesc}</p>
          <Link href="/qa">
            <button className="btn-gold">{t.guide.goToQA}</button>
          </Link>
        </motion.div>
      </div>
    </MainLayout>
  );
}
