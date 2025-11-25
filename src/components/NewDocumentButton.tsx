/** @format */

'use client';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

function NewDocumentButton() {
	const router = useRouter();

	const handleCreateNewDocument = async () => {
		try {
			const { docId } = await createNewDocument();
			router.push(`/doc/${docId}`);
		} catch (error) {
			console.error('Error creating document:', error);
		}
	};

	return <Button onClick={handleCreateNewDocument}>New Document</Button>;
}

export default NewDocumentButton;
