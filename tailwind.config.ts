import type {Config} from "tailwindcss";
export default {
  darkMode:["class"],
  content:["./app/**/*.{ts,tsx}","./components/**/*.{ts,tsx}","./lib/**/*.{ts,tsx}"],
  theme:{extend:{
    colors:{ink:"#101114",muted:"#6b7280",paper:"#f7f7f5",line:"#e5e7eb",accent:"#635bff","accent-soft":"#eeecff",success:"#15803d",danger:"#dc2626"},
    boxShadow:{soft:"0 16px 50px rgba(16,17,20,.08)",card:"0 1px 2px rgba(16,17,20,.04),0 8px 28px rgba(16,17,20,.06)"}
  }},
  plugins:[]
} satisfies Config;
