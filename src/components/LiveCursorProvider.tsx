/** @format */

'use client';

import { useMyPresence, useOthers } from '@liveblocks/react/suspense';
import React, { PointerEvent } from 'react';

import FollowPointer from './FollowPointer';

function LiveCursorProvider({ children }: { children: React.ReactNode }) {
	const [myPresence, updateMyPresence] = useMyPresence();
	const others = useOthers();

	function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
		const cursor = { x: Math.floor(e.pageX), y: Math.floor(e.pageY) };
		updateMyPresence({ cursor });
	}

	function handlePointerLeave() {
		updateMyPresence({ cursor: null });
	}

	return (
		<div
			data-self-cursor={
				myPresence.cursor
					? `${myPresence.cursor.x},${myPresence.cursor.y}`
					: 'none'
			}
			onPointerMove={handlePointerMove}
			onPointerLeave={handlePointerLeave}>
			{others
				.filter((other) => other.presence?.cursor !== null)
				.map(({ connectionId, presence, info }) => (
					<FollowPointer
						key={connectionId}
						connectionId={connectionId}
						cursor={presence.cursor!}
						info={info}
						title={`User: ${connectionId}`}
					/>
				))}
			{children}
		</div>
	);
}

export default LiveCursorProvider;
