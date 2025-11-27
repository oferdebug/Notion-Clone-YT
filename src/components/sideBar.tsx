/** @format */
'use client';

import { useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import { MenuIcon } from 'lucide-react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, DocumentData } from 'firebase/firestore';

import NewDocumentButton from './NewDocumentButton';
import SidebarOption from './SidebarOption';
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from './ui/sheet';
import { db } from '../../firebase';

type RoomDocument = {
	id: string;
	createdAt: unknown;
	role: string;
	roomId: string;
	userId: string;
};

function SideBar() {
	const { user } = useUser();
	const userId = user?.id ?? null;
	// collectionGroup + where
	const roomsRef = userId ? collection(db, 'users', userId, 'rooms') : null;

	const [data] = useCollection(roomsRef ? query(roomsRef) : null);

	const groupedData = useMemo(() => {
		if (!data) return { owner: [], editor: [] } as const;

		return data.docs.reduce<{
			owner: RoomDocument[];
			editor: RoomDocument[];
		}>(
			(acc, curr) => {
				const roomData = curr.data() as DocumentData;
				const typedRoom: RoomDocument = {
					id: curr.id,
					createdAt: roomData.createdAt,
					role: roomData.role,
					roomId: roomData.roomId,
					userId: roomData.userId,
				};

				if (typedRoom.role === 'Owner') {
					acc.owner.push(typedRoom);
				} else {
					acc.editor.push(typedRoom);
				}

				return acc;
			},
			{
				owner: [],
				editor: [],
			}
		);
	}, [data]);

	const menuOptions = (
		<div className='flex flex-col gap-2'>
			<NewDocumentButton />
			{groupedData.owner.length === 0 ? (
				<h2 className='text-gray-500 font-semibold text-sm'>
					No Documents Found
				</h2>
			) : (
				<>
					<h2 className='text-gray-500 font-semibold text-sm'>My Documents</h2>
					{groupedData.owner.map((doc) => (
						<SidebarOption
							key={doc.id}
							id={doc.id}
							href={`/doc/${doc.roomId}`}
						/>
					))}
				</>
			)}

			{/* Shared With Me Function */}
			{groupedData.editor.length > 0 && (
				<>
					<h2 className='text-gray-500 font-semibold text-sm'>
						Shared With Me
					</h2>
					{groupedData.editor.map((doc) => (
						<SidebarOption
							key={doc.id}
							id={doc.id}
							href={`/doc/${doc.roomId}`}
						/>
					))}
				</>
			)}
		</div>
	);
	return (
		<div className='p-2 md:p-5 bg-gray-200 relative'>
			<div className='md:hidden'>
				<Sheet>
					<SheetTrigger className='bg-gray-300 rounded-lg border'>
						<MenuIcon
							className='p-2 hover:opacity-30 rounded-lg'
							size={40}
						/>
					</SheetTrigger>

					<SheetContent
						side='left'
						className='h-full w-80 fixed z-50 overflow-y-auto rounded-none'>
						<SheetHeader>
							<SheetTitle>Menu</SheetTitle>
						</SheetHeader>

						<div className='mt-4'>{menuOptions}</div>

						<SheetFooter />
					</SheetContent>
				</Sheet>
			</div>

			<div className='hidden md:inline'>{menuOptions}</div>
		</div>
	);
}

export default SideBar;
