import {cn} from '@/lib/util/utils';
import {useStore} from '@/components/appLayout/hooks/use-store';
import {Button} from '@/components/ui/button';
import {useSidebarToggle} from '@/components/appLayout/hooks/use-sidebar-toggle';
import {Link} from 'react-router-dom';
import {SidebarToggle} from './sidebar-toggle';
import {Menu} from './menu';
import {Group} from '../data/menu-list';

interface SidebarProps {
	menuList: Group[];
}

export function Sidebar({menuList}: SidebarProps) {
	const sidebar = useStore(useSidebarToggle, (state) => state);

	if (!sidebar) return null;

	return (
		<aside
			className={cn(
				'fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300',
				sidebar?.isOpen === false ? 'w-[90px]' : 'w-72',
			)}
		>
			<SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
			<div className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800">
				<Button
					className={cn(
						'transition-transform ease-in-out duration-300 mb-1',
						sidebar?.isOpen === false ? 'translate-x-1' : 'translate-x-0',
					)}
					variant="link"
					asChild
				>
					<Link to="/dashboard" className="flex items-center gap-2">
						<img src="/icon.svg" alt="icon" className="w-6 h-6" />
						<h1
							className={cn(
								'font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300',
								sidebar?.isOpen === false
									? '-translate-x-96 opacity-0 hidden'
									: 'translate-x-0 opacity-100',
							)}
						>
							PC BEE
						</h1>
					</Link>
				</Button>
				<Menu isOpen={sidebar?.isOpen} menuList={menuList} />
			</div>
		</aside>
	);
}
