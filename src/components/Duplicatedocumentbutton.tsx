'use client';
import { useState } from 'react';

import {
  Copy,
  Loader2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { duplicateDocument } from '../../actions/actions';
import { Button } from './ui/button';

interface DuplicatedocumentbuttonProps {
    docId: string;
    className?: string;
}
function Duplicatedocumentbutton({
    docId,
    className,
}: DuplicatedocumentbuttonProps) {
    const router = useRouter();
    const [isDuplicating, setIsDuplicating] = useState(false);

    const handleDuplicate = async () => {
        setIsDuplicating(true);

        try {
            const result = await duplicateDocument(docId);
            
            if (result.success && result.docId) {
                toast.success('Document duplicated successfully!', {
                    description: 'opening the new document...',
                });
                router.push(`/doc/${result.docId}`);
            } else {
                toast.error('Failed to duplicate document...', {
                    description: result.error ||'Please ry Again Later',
                });
            }
        } catch (error) {
            console.error('Duplicate Error:', error);
            toast.error('Something Went Wrong...', {
                description: 'Unable To Duplicate Document, Please Try Again Later',
            });
        } finally {
            setIsDuplicating(false);
        }
    }
    return (
        <Button
            onClick={handleDuplicate}
            variant={'ghost'}
            size={'sm'}
            className={className}
            disabled={isDuplicating}
        >
            {isDuplicating ? (
                <>
                    <Loader2 className='animate-spin' size={16}/>
                    Duplicating...
                </>
            ) : (
                    <>
                        <Copy size={16} className='mr-2' />
                    Duplicate
                </>
            )}
        </Button>
    );
}

export default Duplicatedocumentbutton
