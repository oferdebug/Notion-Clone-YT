/** @format */

'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { useTransition } from 'react';
import { createNewDocument } from '../../actions/actions';
import { Plus, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

function NewDocumentButton() {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const handleCreateNewDocument = () => {
		startTransition(async () => {
			try {
				const { docId } = await createNewDocument();
				toast.success('Document created!', {
					description: 'Your new document is ready to edit.',
					duration: 3000,
				});
				router.push(`/doc/${docId}`);
			} catch (error) {
				console.error('Failed to create document:', error);
				toast.error('Failed to create document', {
					description: 'Please try again later.',
					duration: 4000,
				});
			}
		});
	};

	return (
		<Button
			onClick={handleCreateNewDocument}
			disabled={isPending}
			className="w-full bg-linear-to-r from-primary to-accent text-white hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold text-base py-6 rounded-xl group relative overflow-hidden"
		>
			<div className="absolute inset-0 bg-linear-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
			
			<div className="relative flex items-center justify-center gap-2">
				{isPending ? (
					<>
						<Loader2 className="animate-spin" size={20} />
						<span>Creating...</span>
					</>
				) : (
					<>
						<div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
							<Plus size={18} strokeWidth={3} />
						</div>
						<span>New Document</span>
						<Sparkles size={16} className="opacity-70 group-hover:opacity-100 transition-opacity" />
					</>
				)}
			</div>
		</Button>
	);
}

export default NewDocumentButton;