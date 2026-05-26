import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0B0F14',
        panel: '#151C24',
        accent: '#3B82F6',
        textMuted: '#94A3B8'
      }
    }
  },
  plugins: []
};

export default config;