/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // src 폴더 내의 모든 JS, JSX, TS, TSX 파일을 대상으로 설정
    "./public/index.html", // public 폴더 내의 index.html 파일도 포함
  ],
  theme: {
    extend: {
      colors: {
        "tomato-color": "var(--tomato-color)",
        "tomato-color-hover": "var(--tomato-color-hover)",
        "tomato-color-active": "var(--tomato-color-active)",
      },
    },
  },
  plugins: [],
};
