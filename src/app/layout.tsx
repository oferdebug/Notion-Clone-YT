/** @format */

import type { Metadata } from 'next';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import Header from '@/components/header';
import SideBar from '@/components/sideBar';

export const metadata: Metadata = {
	title: 'Notion-Clone',
	description: 'A productivity app built with AI features',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<ClerkProvider>
				<body>
					<Header />
					<div className='flex min-h-screen'>
						<SideBar />
						{/* <div className='flex-1 p-4 bg-gray-100 overflow-y-auto scrollbar-hide'> */}
						{children}
						{/* </div> */}
					</div>
				</body>
			</ClerkProvider>
		</html>
	);
}
