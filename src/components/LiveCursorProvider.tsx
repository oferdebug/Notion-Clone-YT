/** @format */

'use client';

import { useMyPresence, useOthers } from '@liveblocks/react/suspense';
import React from 'react';
import FollowPointer from './FollowPointer';

function LiveCursorProvider({ children }: { children: React.ReactNode }) {
	const [myPresence, updateMyPresence] = useMyPresence();
	const others = useOthers();

	const selfCursor = myPresence.cursor
		? `${myPresence.cursor.x},${myPresence.cursor.y}`
		: 'none';

	function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
		const cursor = { x: Math.floor(event.pageX), y: Math.floor(event.pageY) };
		updateMyPresence({ cursor });
	}

	function handlePointerLeave() {
		updateMyPresence({ cursor: null });
	}

	return (
		<div
			data-self-cursor={selfCursor}
			onPointerMove={handlePointerMove}
			onPointerLeave={handlePointerLeave}>
			{others
				.filter((other) => other.presence.cursor !== null)
				.map(({ connectionId, presence, info }) => (
					<FollowPointer
						connectionId={connectionId}
						key={connectionId}
						info={info}
						x={presence.cursor!.x}
						y={presence.cursor!.y}
					/>
				))}
			{children}
		</div>
	);
}

export default LiveCursorProvider;
