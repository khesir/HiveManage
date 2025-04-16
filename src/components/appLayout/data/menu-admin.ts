import {
	Tag,
	Users,
	Settings,
	LayoutGrid,
	LucideIcon,
	Terminal,
	UserSquareIcon,
	ShoppingBag,
	BoxesIcon,
	BoxIcon,
	Banknote,
	ShoppingCart,
	Scroll,
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

export function getAdminMenuList(pathname: string): Group[] {
	return [
		{
			groupLabel: '',
			menus: [
				{
					href: '/admin/dashboard',
					label: 'Dashboard',
					active: pathname.includes('/admin/dashboard'),
					icon: LayoutGrid,
					submenus: [],
				},
				{
					href: '/admin/settings',
					label: 'Settings',
					active: pathname.includes('/admin/settings'),
					icon: Settings,
					submenus: [],
				},
			],
		},
		{
			groupLabel: 'Systems',
			menus: [
				{
					href: '/admin/system/employee',
					label: 'Employees & Accounts',
					active: pathname.includes('/admin/ems'),
					icon: UserSquareIcon,
					submenus: [],
				},
				{
					href: '/admin/system/customer',
					label: 'Customer',
					active: pathname.includes('/admin/customer'),
					icon: Users,
					submenus: [],
				},
				{
					href: '/admin/system/sales',
					label: 'Services & Sales',
					active: pathname.includes('/admin/sales'),
					icon: Tag,
					submenus: [
						{
							href: '/admin/system/sales/list',
							label: 'Sales',
							icon: ShoppingCart,
							active: pathname === '/admin/system/sales/list',
						},
						{
							href: '/admin/system/sales/services',
							label: 'Service',
							icon: Scroll,
							active: pathname === '/admin/system/sales/services',
						},
						{
							href: '/admin/system/payments',
							label: 'Payments',
							icon: Banknote,
							active: pathname === '/admin/system/payments',
						},
					],
				},
				{
					href: '/admin/system/inventory/products',
					label: 'Inventory',
					active: pathname.includes('/admin/system/inventory/products'),
					icon: ShoppingBag,
					submenus: [
						{
							href: '/admin/system/inventory/products',
							label: 'Products',
							icon: BoxIcon,
							active: pathname === '/admin/system/inventory/products',
						},
						{
							href: '/admin/system/inventory/orders',
							label: 'Orders',
							icon: BoxesIcon,
							active: pathname === '/admin/system/inventory/orders',
						},
						{
							href: '/admin/system/inventory/suppliers',
							label: 'Supplier',
							icon: Users,
							active: pathname === '/admin/system/inventory/suppliers',
						},
					],
				},
			],
		},
	];
}

export function getDefaultMenuList(pathname: string): Group[] {
	return [
		{
			groupLabel: '',
			menus: [
				{
					href: '/admin/dashboard',
					label: 'Dashboard',
					active: pathname.includes('/admin/dashboard'),
					icon: LayoutGrid,
					submenus: [],
				},
			],
		},
		{
			groupLabel: 'Settings',
			menus: [
				{
					href: '/admin/terminal',
					label: 'Terminal',
					active: pathname.includes('/admin/terminal'),
					icon: Terminal,
					submenus: [],
				},
				{
					href: '/admin/setting',
					label: 'Settings',
					active: pathname.includes('/admin/settings'),
					icon: Settings,
					submenus: [],
				},
			],
		},
	];
}
