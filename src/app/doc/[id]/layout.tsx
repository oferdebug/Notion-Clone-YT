/** @format */

import { auth } from '@clerk/nextjs/server';

function DocLayout({
	children,
	params: { id: string },
}: {
	children: React.ReactNode;
	params: { id: string };
}) {
	auth.protect();

	const docId = string;

	return <div data-doc-id={docId}>{children}</div>;
}

export default DocLayout;
