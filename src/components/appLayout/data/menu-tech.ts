import {
	Users,
	Settings,
	LayoutGrid,
	LucideIcon,
	LayoutPanelLeft,
	Package,
	ShoppingBag,
} from 'lucide-react';

type Submenu = {
	href: string;
	label: string;
	icon: LucideIcon;
	active: boolean;
};

type Menu = {
	href: string;
	label: string;
	active: boolean;
	icon: LucideIcon;
	submenus: Submenu[];
};

export type Group = {
	groupLabel: string;
	menus: Menu[];
};

export function getTechMenuList(pathname: string): Group[] {
	return [
		{
			groupLabel: '',
			menus: [
				{
					href: '/tech/dashboard',
					label: 'Dashboard',
					active: pathname.includes('/tech/dashboard'),
					icon: LayoutGrid,
					submenus: [],
				},
			],
		},
		{
			groupLabel: 'Systems',
			menus: [
				{
					href: '/tech/system/overview',
					label: 'Overview',
					active: pathname === '/tech/system/overview',
					icon: LayoutPanelLeft,
					submenus: [],
				},
				{
					href: '/tech/system/services/list',
					label: 'Service',
					active: pathname.includes('/tech/system/services/list'),
					icon: Package,
					submenus: [],
				},
				{
					href: '/tech/system/customer',
					label: 'Customer Database',
					active: pathname.includes('/tech/system/customer'),
					icon: Users,
					submenus: [],
				},
				{
					href: '/tech/system/inventory/products',
					label: 'Products',
					active: pathname.includes('/admin/system/inventory/products'),
					icon: ShoppingBag,
					submenus: [],
				},
			],
		},
		{
			groupLabel: 'Settings',
			menus: [
				// {
				// 	href: '/tech/terminal',
				// 	label: 'Terminal',
				// 	active: pathname.includes('/terminal'),
				// 	icon: Terminal,
				// 	submenus: [],
				// },
				{
					href: '/tech/settings',
					label: 'Settings',
					active: pathname.includes('/settings'),
					icon: Settings,
					submenus: [],
				},
			],
		},
	];
}
