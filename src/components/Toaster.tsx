'use client';
import {Toaster as Sonner} from 'sonner';
import { useTheme } from 'next-themes';
export function Toaster() {
    const { resolvedTheme } = useTheme();
    return(
        <Sonner
            theme={resolvedTheme as 'light' | 'dark'}
            position='top-center'
            toastOptions={{
                style: {
                    background: 'var(--background)',
                    color: 'var(--foreground)',
                    border:'1px solid var(--border)',
                },
                className:'rounded-xl shadow-lg',
            }}
            richColors
        />
    );
}
