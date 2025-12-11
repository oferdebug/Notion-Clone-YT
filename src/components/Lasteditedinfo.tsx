'use client'

import { useState } from 'react';

import { Clock } from 'lucide-react';

interface LastEditedInfoProps {
    updatedAt?: { seconds: number } | null;
    updatedBy?: string| null;
}

export default function LastEditedInfo({ 
    updatedAt,
    updatedBy,
}: LastEditedInfoProps) {
    const [now] = useState(() => Date.now());

    const timeAgo = (
        timestamp: { seconds: number } | null | undefined
    ): string => {
        if (!timestamp) return 'just now';

        const seconds = Math.floor((now - timestamp.seconds * 1000) / 1000);
        if (seconds < 60) return 'just Now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
        if (seconds < 2592000) return `${Math.floor(seconds / 604800)} weeks ago`;
        if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} months ago`;
        return new Date(timestamp.seconds * 1000).toLocaleDateString();
    };
    return (
        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
            <Clock size={16} />
            <span>
                Last Edited{timeAgo(updatedAt)}
                {updatedBy && `By${updatedBy}`}
            </span>
        </div>
    );
}
