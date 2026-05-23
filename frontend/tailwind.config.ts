import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Vàng son (temple gold)
        gold: {
          50:  '#FDF8EC',
          100: '#F9EEC8',
          200: '#F2D98C',
          300: '#E8C050',
          400: '#D4A017',
          500: '#B8860B',
          600: '#9A6F09',
          700: '#7A5507',
          800: '#5C3F05',
          900: '#3D2A03',
        },
        // Cam nghệ (saffron — màu áo tu sĩ)
        saffron: {
          50:  '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#EA6C00',
          600: '#C55A00',
          700: '#9D4700',
          800: '#7C3800',
          900: '#5C2800',
        },
        // Đỏ son (maroon — màu cửa chùa, pháp y Tây Tạng)
        maroon: {
          50:  '#FDF2F4',
          100: '#FCE4E8',
          200: '#F8C9D2',
          300: '#F09BAB',
          400: '#E56079',
          500: '#8B2635',
          600: '#6E1D28',
          700: '#55161E',
          800: '#3D1016',
          900: '#280A0E',
        },
        // Xanh ngọc (jade — màu thiên nhiên, Phật giáo Mật tông)
        jade: {
          50:  '#EDFAF4',
          100: '#D2F4E4',
          200: '#A5E7C9',
          300: '#5FD3A2',
          400: '#2DB67D',
          500: '#1A9362',
          600: '#14744D',
          700: '#10593C',
          800: '#0C3F2B',
          900: '#07281B',
        },
        // Nền cuộn giấy cổ (parchment)
        parchment: {
          50:  '#FFFDF7',
          100: '#FDF6E3',
          200: '#F8EBC4',
          300: '#F0D898',
          400: '#E4BE66',
          500: '#D4A017',
        },
        // Màu nâu gỗ chùa (temple wood)
        temple: {
          dark:   '#2A1505',
          medium: '#7A5330',
          light:  '#B8936A',
          bg:     '#FDF6E3',
        },
      },
      fontFamily: {
        sans:    ['Be Vietnam Pro', 'system-ui', 'sans-serif'],
        serif:   ['Philosopher', 'Palatino Linotype', 'Georgia', 'serif'],
        display: ['Cinzel', 'Trajan Pro', 'Georgia', 'serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'card':    '0 1px 4px rgba(42,21,5,0.06), 0 6px 20px rgba(42,21,5,0.05)',
        'gold':    '0 4px 20px rgba(184,134,11,0.25)',
        'saffron': '0 4px 20px rgba(234,108,0,0.30)',
        'maroon':  '0 4px 20px rgba(139,38,53,0.25)',
        'inner-gold': 'inset 0 1px 0 rgba(212,160,23,0.3)',
        'glow':    '0 0 24px rgba(212,160,23,0.4)',
      },
      backgroundImage: {
        'lotus-pattern': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%23D4A017' stroke-width='0.6' opacity='0.18'%3E%3Cellipse cx='40' cy='40' rx='14' ry='24' transform='rotate(0 40 40)'/%3E%3Cellipse cx='40' cy='40' rx='14' ry='24' transform='rotate(45 40 40)'/%3E%3Cellipse cx='40' cy='40' rx='14' ry='24' transform='rotate(90 40 40)'/%3E%3Cellipse cx='40' cy='40' rx='14' ry='24' transform='rotate(135 40 40)'/%3E%3Ccircle cx='40' cy='40' r='5'/%3E%3C/g%3E%3C/svg%3E\")",
        'dharma-pattern': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%23B8860B' stroke-width='0.5' opacity='0.12'%3E%3Ccircle cx='60' cy='60' r='30'/%3E%3Ccircle cx='60' cy='60' r='20'/%3E%3Ccircle cx='60' cy='60' r='8'/%3E%3Cline x1='60' y1='30' x2='60' y2='90'/%3E%3Cline x1='30' y1='60' x2='90' y2='60'/%3E%3Cline x1='39' y1='39' x2='81' y2='81'/%3E%3Cline x1='81' y1='39' x2='39' y2='81'/%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in':   'fadeIn 0.4s ease-out',
        'slide-up':  'slideUp 0.4s ease-out',
        'float':     'float 4s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
        'glow':      'glow 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        float:   { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        glow:    { '0%,100%': { filter: 'drop-shadow(0 0 6px rgba(212,160,23,0.5))' }, '50%': { filter: 'drop-shadow(0 0 18px rgba(212,160,23,0.9))' } },
      },
    },
  },
  plugins: [],
};

export default config;
