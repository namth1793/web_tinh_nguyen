'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, Users, BookOpen, Award, ArrowRight, Globe, Target, Sparkles } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

const STATS = [
  { icon: Users, label: 'Học viên', value: '500+', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { icon: BookOpen, label: 'Câu hỏi', value: '500+', color: 'text-gold-500', bg: 'bg-gold-50 dark:bg-gold-900/20' },
  { icon: Award, label: 'Bài thi', value: '10+', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  { icon: Globe, label: 'Chủ đề', value: '7', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
];

const TEAM = [
  { name: 'Thầy Pháp Hành', role: 'Cố vấn Phật pháp', avatar: '🧘', desc: '20 năm tu học và giảng dạy Phật pháp' },
  { name: 'Minh Tâm', role: 'Biên soạn nội dung', avatar: '📖', desc: 'Cử nhân Phật học, chuyên gia giáo dục' },
  { name: 'Tuệ Minh', role: 'Phát triển hệ thống', avatar: '💻', desc: 'Lập trình viên, Phật tử thuần thành' },
];

const VALUES = [
  { icon: '🙏', title: 'Chân thật', desc: 'Mọi nội dung đều được kiểm chứng từ kinh điển Pali và các bộ luận uy tín.' },
  { icon: '🌱', title: 'Tinh tấn', desc: 'Khuyến khích học tập đều đặn, mỗi ngày một chút trí tuệ.' },
  { icon: '💎', title: 'Miễn phí', desc: 'Pháp vô giá — toàn bộ nội dung hoàn toàn miễn phí, không quảng cáo.' },
  { icon: '🤝', title: 'Cộng đồng', desc: 'Kết nối những người học Phật, cùng nhau tinh tấn trên con đường giác ngộ.' },
];

export default function AboutPage() {
  return (
    <MainLayout showRightSidebar={false}>
      <div className="max-w-4xl page-enter">

        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl mb-10 p-10 text-center"
          style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 50%, #F59E0B 100%)' }}
        >
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-orange-300/20 blur-2xl" />

          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-7xl mb-4 relative z-10"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' }}
          >
            🪷
          </motion.div>

          <h1 className="relative z-10 text-3xl font-black text-amber-900 mb-3">
            Phật Pháp Test
          </h1>
          <p className="relative z-10 text-amber-800/90 max-w-xl mx-auto leading-relaxed text-sm">
            Nền tảng học và kiểm tra kiến thức Phật giáo trực tuyến, giúp mọi người tiếp cận giáo lý nhà Phật một cách hệ thống, khoa học và hoan hỷ.
          </p>

          <div className="relative z-10 mt-5 inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full text-amber-800 text-xs font-semibold border border-white/60">
            <Sparkles size={13} /> Học Phật · Hiểu Pháp · Ứng Dụng · An Lạc
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card p-5 text-center"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-3 ${s.bg}`}>
                <s.icon size={20} className={s.color} />
              </div>
              <p className="text-2xl font-black text-temple-dark dark:text-cream-100">{s.value}</p>
              <p className="text-xs text-temple-medium mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center">
              <Target size={20} className="text-gold-600" />
            </div>
            <h2 className="text-xl font-black text-temple-dark dark:text-cream-100">Sứ mệnh</h2>
          </div>
          <div className="space-y-3 text-sm text-temple-dark dark:text-cream-200 leading-relaxed">
            <p>
              <strong>Phật Pháp Test</strong> được tạo ra với mong muốn giúp người học Phật có thể kiểm tra và củng cố kiến thức một cách hệ thống. Trong xã hội hiện đại bận rộn, chúng tôi tin rằng mỗi người đều có thể dành 10-15 phút mỗi ngày để học và ôn luyện giáo lý Phật pháp.
            </p>
            <p>
              Nội dung được biên soạn dựa trên kinh điển Pali (Theravāda), các bộ luận A Hàm và tài liệu của nhiều truyền thống Phật giáo uy tín. Chúng tôi cam kết không thêm thắt, không diễn giải sai lệch giáo lý gốc.
            </p>
            <p>
              Hệ thống học tập được thiết kế theo nguyên tắc <em>"học từ cơ bản đến nâng cao"</em> — từ Tứ Diệu Đế, Bát Chánh Đạo đến các giáo lý chuyên sâu về Thiền định, Kinh điển và Lịch sử Phật giáo.
            </p>
          </div>
        </motion.div>

        {/* Values */}
        <div className="mb-10">
          <h2 className="text-xl font-black text-temple-dark dark:text-cream-100 mb-5 flex items-center gap-2">
            <Heart size={22} className="text-gold-500" /> Giá trị cốt lõi
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="card p-5 flex gap-4"
              >
                <span className="text-3xl flex-shrink-0">{v.icon}</span>
                <div>
                  <h3 className="font-bold text-temple-dark dark:text-cream-100 mb-1">{v.title}</h3>
                  <p className="text-sm text-temple-medium leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-10">
          <h2 className="text-xl font-black text-temple-dark dark:text-cream-100 mb-5 flex items-center gap-2">
            <Users size={22} className="text-gold-500" /> Đội ngũ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="card p-5 text-center"
              >
                <div className="text-5xl mb-3">{member.avatar}</div>
                <h3 className="font-bold text-temple-dark dark:text-cream-100">{member.name}</h3>
                <p className="text-xs font-semibold text-gold-500 mb-2">{member.role}</p>
                <p className="text-xs text-temple-medium leading-relaxed">{member.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="card p-8 text-center bg-gradient-to-br from-gold-50 to-amber-50 dark:from-gold-900/20 dark:to-amber-900/20 border-gold-200 dark:border-gold-800"
        >
          <div className="text-4xl mb-3">☸️</div>
          <h2 className="text-xl font-black text-temple-dark dark:text-cream-100 mb-2">Bắt đầu hành trình học Phật</h2>
          <p className="text-sm text-temple-medium mb-5 max-w-md mx-auto">Mỗi ngày một chút trí tuệ, mỗi bước một chút an lạc. Hãy cùng chúng tôi trên con đường học Phật.</p>
          <div className="flex justify-center gap-3">
            <Link href="/dashboard">
              <button className="btn-gold flex items-center gap-2">
                Bắt đầu học <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/register">
              <button className="btn-outline-gold">Tạo tài khoản</button>
            </Link>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
