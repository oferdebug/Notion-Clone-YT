/** @format */

import NewDocumentButton from './NewDocumentButton';

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from './ui/sheet';
import { MenuIcon } from 'lucide-react';
import { Button } from './ui/button';
// import {
// 	Drawer,
// 	DrawerTrigger,
// 	DrawerContent,
// 	DrawerHeader,
// 	DrawerTitle,
// 	DrawerFooter,
// 	DrawerClose,
// } from './ui/drawer';

function sideBar() {
	const menuOptions = (
		<>
			<NewDocumentButton />

			{/* Future Menu Options */}
			{/* My Documents */}
			{/* Shared with me */}
			{/* Trash */}
		</>
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
						<div>{menuOptions}</div>
						<SheetFooter>{/* <SheetClose></SheetClose> */}</SheetFooter>
					</SheetContent>
				</Sheet>
			</div>

			<div className='hidden md:inline'>{menuOptions}</div>
		</div>
	);
}

export default sideBar;
