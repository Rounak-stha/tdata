import type { Config } from 'tailwindcss'
import tailwindAnimate from 'tailwindcss-animate'
import preset from '@tdata/global/configs/tailwind.config'

export default {
	darkMode: ['class'],
	content: [
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
		// https://tailwindcss.com/docs/content-configuration#working-with-third-party-libraries,
		// https://github.com/tailwindlabs/tailwindcss/discussions/8402
		'../editor/src/**/*.{js,ts,jsx,tsx,mdx}'
	],
	presets: [preset],
	plugins: [tailwindAnimate],
    theme: {
    	extend: {
    		colors: {
    			sidebar: {
    				DEFAULT: 'hsl(var(--sidebar-background))',
    				foreground: 'hsl(var(--sidebar-foreground))',
    				primary: 'hsl(var(--sidebar-primary))',
    				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
    				accent: 'hsl(var(--sidebar-accent))',
    				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
    				border: 'hsl(var(--sidebar-border))',
    				ring: 'hsl(var(--sidebar-ring))'
    			}
    		}
    	}
    }
} satisfies Config
