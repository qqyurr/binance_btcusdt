/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "binance-green": "#22c55e", // 상승 시 색상
        "binance-red": "#ef4444", // 하락 시 색상
        "binance-bg": "#0f172a", // Binance 어두운 테마 배경
      },
    },
  },
  plugins: [],
};
