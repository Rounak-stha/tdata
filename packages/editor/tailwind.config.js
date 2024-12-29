import preset from '@tdata/global/configs/tailwind.config'

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './web/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
	presets: [preset],
	plugins: [require('@tailwindcss/typography')]
}
