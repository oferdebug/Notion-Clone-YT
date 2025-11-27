/** @format */
'use client';
import { db } from '../../firebase';
import { doc } from 'firebase/firestore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDocumentData } from 'react-firebase-hooks/firestore';

function SidebarOption({ href, id }: { href: string; id: string }) {
	const [data, loading, error] = useDocumentData(doc(db, 'documents', id));
	const pathname = usePathname();
	const isActive = href.includes(pathname) && pathname !== '/';

	if (loading) {
		return (
			<div className='border p-2 rounded-md border-gray-300 animate-pulse'>
				<p className='h-4 bg-gray-200 rounded' />
			</div>
		);
	}

	if (error) {
		return (
			<div className='border p-2 rounded-md border-red-400 text-red-500 text-sm'>
				Failed to load document
			</div>
		);
	}

	if (!data) return null;

	return (
		<Link
			href={href}
			className={`border p-2 rounded-md ${
				isActive ? 'bg-gray-300 font-bold border-black' : 'border-gray-400'
			}`}>
			<p className='truncate'>{data.title}</p>
		</Link>
	);
}

export default SidebarOption;
