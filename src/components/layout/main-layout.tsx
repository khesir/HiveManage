'use client';

import {cn} from '@/lib/util/utils';
import {useStore} from '@/components/hooks/use-store';
import {useSidebarToggle} from '@/components/hooks/use-sidebar-toggle';
import {Outlet, useLocation} from 'react-router-dom';
import {Sidebar} from './components/sidebar';
import {
	getAdminMenuList,
	getDefaultMenuList,
	getSalesMenuList,
	getTechMenuList,
} from '../constant/menu-list';
import {SheetMenu} from './components/sheet-menu';
import {ModeToggle} from '../providers/mode-toggle';
import {UserNav} from './components/user-nav';
import useHeaderTitle from '../hooks/use-head-title';

export default function MainLayout({userType}: {userType: string}) {
	const sidebar = useStore(useSidebarToggle, (state) => state);
	const location = useLocation();
	const pathname = location.pathname;
	const {title} = useHeaderTitle();

	const menuList = (() => {
		if (userType === 'admin') {
			return getAdminMenuList(pathname);
		} else if (userType === 'sales') {
			return getSalesMenuList(pathname);
		} else if (userType === 'tech') {
			return getTechMenuList(pathname);
		} else {
			return getDefaultMenuList(pathname);
		}
	})();

	if (!sidebar) return null;

	return (
		<>
			<Sidebar menuList={menuList} />
			<main
				className={cn(
					'min-h-[calc(100vh_-_56px)] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300',
					sidebar?.isOpen === false ? 'lg:ml-[90px]' : 'lg:ml-72',
				)}
			>
				{/* Navbar */}
				<header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
					<div className="mx-4 sm:mx-8 flex h-14 items-center">
						<div className="flex items-center space-x-4 lg:space-x-0">
							<SheetMenu menuList={menuList} />

							<h1 className="font-bold">{title}</h1>
						</div>
						<div className="flex flex-1 items-center justify-end">
							<ModeToggle />
							<UserNav />
						</div>
					</div>
				</header>
				<Outlet />
			</main>
		</>
	);
}
