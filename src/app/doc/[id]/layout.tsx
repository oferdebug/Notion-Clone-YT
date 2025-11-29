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

	return <div>{children}</div>;
}

export default DocLayout;
