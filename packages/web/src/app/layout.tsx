import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'

import './globals.css'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={`${inter.className} h-svh w-svh overflow-auto`}>
				<ScrollArea className='h-full w-full'>
					<ThemeProvider attribute='class' defaultTheme='dark' enableSystem={false} storageKey='kanban-theme'>
						{children}
					</ThemeProvider>
					<ScrollBar orientation='vertical' />
				</ScrollArea>
			</body>
		</html>
	)
}
