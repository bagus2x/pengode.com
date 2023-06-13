import DarkModeProvider from '@pengode/blog/app/components/dark-mode-provider'
import Header from '@pengode/blog/app/components/header'
import ReactQueryProvider from '@pengode/blog/app/components/react-query-provider'
import { Toaster } from '@pengode/blog/components/ui/toaster'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: "Pengode Blog | Tubagus Saifulloh's Blog",
	description: 'Here is where you can discover all of my tech-related articles',
	icons: {
		icon: '/favicon.ico',
	},
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='en'>
			<body className={`${inter.className}`}>
				<ReactQueryProvider>
					<DarkModeProvider>
						<Header />
						{children}
					</DarkModeProvider>
					<Toaster />
				</ReactQueryProvider>
			</body>
		</html>
	)
}
