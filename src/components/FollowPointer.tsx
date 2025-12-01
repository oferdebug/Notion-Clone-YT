/** @format */

'use client';

import {
	AnimatePresence,
	motion,
	useMotionValue,
	type MotionValue,
} from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

import stringToColor from '@/lib/stringToColor';
import { cn } from '@/lib/utils';

type PointerInfo = {
	name: string;
	email: string;
	avatar: string;
};

type PointerCardProps = {
	children: React.ReactNode;
	className?: string;
	title?: string | React.ReactNode;
	info: PointerInfo;
};

export function FollowerPointerCard({
	children,
	className,
	info,
}: PointerCardProps) {
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const ref = useRef<HTMLDivElement>(null);
	const [rect, setRect] = useState<DOMRect | null>(null);
	const [isInside, setIsInside] = useState(false);

	useEffect(() => {
		if (ref.current) {
			setRect(ref.current.getBoundingClientRect());
		}
	}, []);

	const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
		if (!rect) return;
		const scrollX = window.scrollX;
		const scrollY = window.scrollY;

		x.set(event.clientX - rect.left + scrollX);
		y.set(event.clientY - rect.top + scrollY);
	};

	const handleMouseEnter = () => setIsInside(true);
	const handleMouseLeave = () => setIsInside(false);

	return (
		<div
			ref={ref}
			onMouseMove={handleMouseMove}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			style={{ cursor: 'none' }}
			className={cn('relative', className)}>
			<AnimatePresence>
				{isInside && (
					<FollowPointer
						info={info}
						x={x}
						y={y}
					/>
				)}
			</AnimatePresence>
			{children}
		</div>
	);
}

type FollowPointerProps = {
	connectionId?: number;
	cursor?: { x: number; y: number };
	info: PointerInfo;
	title?: string | React.ReactNode;
	x?: MotionValue<number>;
	y?: MotionValue<number>;
};

export function FollowPointer({
	connectionId,
	cursor,
	info,
	title,
	x,
	y,
}: FollowPointerProps) {
	const top = cursor?.y ?? y;
	const left = cursor?.x ?? x;
	const color = stringToColor(info?.email || 'fallback');

	return (
		<motion.div
			data-connection-id={connectionId ?? 'self'}
			style={{ top, left, pointerEvents: 'none' }}
			initial={{ scale: 1, opacity: 1 }}
			animate={{ scale: 1, opacity: 1 }}
			exit={{ scale: 0, opacity: 0 }}>
			<svg
				stroke={color}
				fill={color}
				strokeWidth='1'
				viewBox='0 0 16 16'
				className='h-6 w-6 -translate-x-3 -translate-y-2.5 -rotate-70'
				height='1em'
				width='1em'
				xmlns='http://www.w3.org/2000/svg'>
				<path d='M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z' />
			</svg>
			<motion.div
				style={{ backgroundColor: color }}
				initial={{ scale: 0.5, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.5, opacity: 0 }}
				className='min-w-max rounded-full bg-neutral-200 px-2 py-2 text-xs font-bold text-black'>
				{info?.name || info?.email || title}
			</motion.div>
		</motion.div>
	);
}

export default FollowPointer;
