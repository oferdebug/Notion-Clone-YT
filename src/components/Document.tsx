/** @format */

'use client';

import { doc, updateDoc } from 'firebase/firestore';
import { FormEvent, useState, useTransition } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { db } from '../../firebase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import useOwner from '@/lib/useOwner';

function Document({ id }: { id: string }) {
	const [data, loading, error] = useDocumentData(doc(db, 'documents', id));
	const [input, setInput] = useState<string | null>(null);
	const [isUpdating, startTransition] = useTransition();
	const isOwner = useOwner(); // Custom hook to determine if the user is the owner

	const currentTitle = input ?? data?.title ?? '';

	const updateTitle = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (currentTitle.trim()) {
			startTransition(async () => {
				await updateDoc(doc(db, 'documents', id), {
					title: currentTitle,
				});
			});
		}
	};

	if (loading) {
		return <p className='p-4 text-gray-500'>Loading document…</p>;
	}

	if (error) {
		return (
			<p className='p-4 text-red-500'>
				Failed to load document: {error.message}
			</p>
		);
	}

	if (!data) {
		return <p className='p-4 text-gray-500'>Document not found.</p>;
	}

	return (
		<div>
			<div>
				<div className='flex max-w-6xl mx-auto justify-between pb-5'>
					<form
						className='flex flex-1 space-x-2'
						onSubmit={updateTitle}>
						{/* Updated Title */}
						<Input
							value={currentTitle}
							onChange={(e) => setInput(e.target.value)}
						/>

						<Button
							disabled={isUpdating}
							type='submit'>
							{isUpdating ? 'Updating...' : 'Update Title'}
						</Button>

						{/* If */}

						{/* Is Owner && InviteUser,Deleteting Documents */}
					</form>
				</div>
			</div>
			<div>
				{/* ManageUsers*/}

				{/* Avataers */}
			</div>
			{/*Collabaretive Editting */}
		</div>
	);
}

export default Document;
