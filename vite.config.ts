import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@apis': path.resolve(__dirname, "./src/apis"),
			'@assets': path.resolve(__dirname, "./src/assets"),
			'@components': path.resolve(__dirname, "./src/components"),
			'@contexts': path.resolve(__dirname, "./src/contexts")
		}
	}
})
