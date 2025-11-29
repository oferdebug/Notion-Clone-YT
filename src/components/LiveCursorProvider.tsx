/** @format */

import { useOthers } from '@liveblocks/react';
import { useMyPresence } from '@liveblocks/react/suspense';

function LiveCursorProvider({ children }: { children: React.ReactNode }) {
	const [myPresence, updateMyPresence] = useMyPresence();
	const others = useOthers();
	return (
		<div
			onPointerMove={handlePointerMove}
			onPointerLeave={handlePointerLeave}>
			{/* Render other users' cursors */}
		</div>
	);
}

export default LiveCursorProvider;
