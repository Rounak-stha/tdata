/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './web/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {}
	},
	plugins: [require('@tailwindcss/typography')]
}