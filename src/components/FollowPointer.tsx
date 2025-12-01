/** @format */

import { motion } from 'framer-motion';

type FollowPointerInfo = {
	name?: string;
	email?: string;
	[key: string]: unknown;
};

type FollowPointerProps = {
	connectionId: number;
	x: number;
	y: number;
	info?: FollowPointerInfo;
	title?: string;
};

function FollowPointer({
	connectionId,
	x,
	y,
	info,
	title,
}: FollowPointerProps) {
	const color = '#000000';

	return (
		<motion.div
			data-connection-id={connectionId}
			className='px-2 py-2 bg-neutral-200 text-black font-bold whitespace-nowrap min-w-max text-xs rounded-full absolute z-50'
			style={{
				top: y,
				left: x,
				pointerEvents: 'none',
			}}
			initial={{ scale: 1, opacity: 1 }}
			animate={{ scale: 1, opacity: 1 }}
			exit={{ scale: 0, opacity: 0 }}>
			<svg
				stroke={color}
				fill={color}
				strokeWidth='1'
				viewBox='0 0 16 16'
				className='h-6 w-6 transform -rotate-70 -translate-x-3 -translate-y-2.5'
				height='1em'
				width='1em'
				xmlns='http://www.w3.org/2000/svg'>
				<path d='M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z' />
			</svg>
			<motion.div>{info?.name ?? info?.email ?? title}</motion.div>
		</motion.div>
	);
}

export default FollowPointer;
