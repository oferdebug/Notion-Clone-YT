/** @format */

'use client';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react/jsx-runtime';
import { Home, FileText, ChevronRight } from 'lucide-react';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '../components/ui/breadcrumb';

function Breadcrumbs() {
	const path = usePathname();
	const segments = path.split('/');
	
	return (
		<Breadcrumb>
			<BreadcrumbList className="flex items-center gap-2">
				<BreadcrumbItem>
					<BreadcrumbLink 
						href='/'
						className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-secondary transition-all duration-200 group"
					>
						<Home size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
						<span className="font-medium">Home</span>
					</BreadcrumbLink>
				</BreadcrumbItem>
				
				{segments.map((segment, index) => {
					if (!segment) return null;
					const href = `/${segments.slice(1, index + 1).join('/')}`;
					const isLast = index === segments.length - 1;
					
					return (
						<Fragment key={segment}>
							<BreadcrumbSeparator>
								<ChevronRight size={16} className="text-muted-foreground" />
							</BreadcrumbSeparator>
							<BreadcrumbItem>
								{isLast ? (
									<BreadcrumbPage className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-semibold">
										<FileText size={16} />
										<span className="max-w-[200px] truncate">{segment}</span>
									</BreadcrumbPage>
								) : (
									<BreadcrumbLink 
										href={href}
										className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-secondary transition-all duration-200 group"
									>
										<FileText size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
										<span className="font-medium max-w-[150px] truncate">{segment}</span>
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
						</Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}

export default Breadcrumbs