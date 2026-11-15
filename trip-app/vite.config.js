import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 相對路徑:部署喺 GitHub Pages 子路徑(/macau.familytravel/trip/)都正常
export default defineConfig({ plugins: [react()], base: './' })
