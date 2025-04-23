import {
	Users,
	LayoutGrid,
	LucideIcon,
	ShoppingBag,
	Banknote,
	BoxesIcon,
	BoxIcon,
	Scroll,
	ShoppingCart,
	Tag,
	UserSquareIcon,
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
					href: '/tech/system/employee',
					label: 'Employees & Accounts',
					active: pathname.includes('/tech/ems'),
					icon: UserSquareIcon,
					submenus: [],
				},
				{
					href: '/tech/system/customer',
					label: 'Customer',
					active: pathname.includes('/tech/customer'),
					icon: Users,
					submenus: [],
				},
				{
					href: '/tech/system/sales',
					label: 'Services & Sales',
					active: pathname.includes('/tech/sales'),
					icon: Tag,
					submenus: [
						{
							href: '/tech/system/sales/list',
							label: 'Sales',
							icon: ShoppingCart,
							active: pathname === '/tech/system/sales/list',
						},
						{
							href: '/tech/system/services',
							label: 'Service',
							icon: Scroll,
							active: pathname === '/tech/system/services',
						},
						{
							href: '/tech/system/payments',
							label: 'Payments',
							icon: Banknote,
							active: pathname === '/tech/system/payments',
						},
					],
				},
				{
					href: '/tech/system/inventory/products',
					label: 'Inventory',
					active: pathname.includes('/tech/system/inventory/products'),
					icon: ShoppingBag,
					submenus: [
						{
							href: '/tech/system/inventory/products',
							label: 'Products',
							icon: BoxIcon,
							active: pathname === '/tech/system/inventory/products',
						},
						{
							href: '/tech/system/inventory/orders',
							label: 'Orders',
							icon: BoxesIcon,
							active: pathname === '/tech/system/inventory/orders',
						},
						{
							href: '/tech/system/inventory/suppliers',
							label: 'Supplier',
							icon: Users,
							active: pathname === '/tech/system/inventory/suppliers',
						},
					],
				},
			],
		},
		// {
		// 	groupLabel: 'Settings',
		// 	menus: [
		// 		// {
		// 		// 	href: '/tech/terminal',
		// 		// 	label: 'Terminal',
		// 		// 	active: pathname.includes('/terminal'),
		// 		// 	icon: Terminal,
		// 		// 	submenus: [],
		// 		// },
		// 		{
		// 			href: '/tech/settings',
		// 			label: 'Settings',
		// 			active: pathname.includes('/settings'),
		// 			icon: Settings,
		// 			submenus: [],
		// 		},
		// 	],
		// },
	];
}
