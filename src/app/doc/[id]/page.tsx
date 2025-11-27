/** @format */

import Document from '@/components/Document';

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

async function DocumentPage({ params }: PageProps) {
	const { id } = await params;

	return (
		<div className='flex flex-col flex-1 min-h-screen'>
			<Document id={id} />
		</div>
	);
}

export default DocumentPage;
