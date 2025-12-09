/** @format */
'use client';
import { db } from '../../firebase';
import { doc } from 'firebase/firestore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { FileText } from 'lucide-react';

function SidebarOption({ href, id }: { href: string; id: string }) {
	const [data, loading, error] = useDocumentData(doc(db, 'documents', id));
	const pathname = usePathname();
	const isActive = href.includes(pathname) && pathname !== '/';

	if (loading) {
		return (
			<div className='p-3 rounded-lg bg-muted animate-pulse'>
				<div className='h-4 bg-muted-foreground/20 rounded w-3/4' />
			</div>
		);
	}

	if (error) {
		return (
			<div className='p-3 rounded-lg border border-destructive/50 bg-destructive/10'>
				<p className='text-destructive text-xs'>Failed to load</p>
			</div>
		);
	}

	if (!data) return null;

	return (
		<Link
			href={href}
			className={`
				group flex items-center gap-3 p-3 rounded-lg transition-all duration-200
				${isActive 
					? 'bg-primary text-primary-foreground shadow-sm' 
					: 'hover:bg-secondary text-foreground'
				}
			`}
		>
			<FileText 
				size={16} 
				className={`flex- shrink-0 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}
			/>
			<p className='truncate text-sm font-medium'>{data.title}</p>
		</Link>
	);
}

export default SidebarOption;