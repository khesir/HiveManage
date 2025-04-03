import {
	Tag,
	Users,
	Settings,
	LayoutGrid,
	LucideIcon,
	PackageOpenIcon,
	Terminal,
	LayoutPanelLeft,
	MessageSquare,
	BotMessageSquareIcon,
	Package,
	UserSquareIcon,
	ShoppingBag,
	BoxesIcon,
	BoxIcon,
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
					href: '/admin/inquiry',
					label: 'Inquiry',
					active: pathname.includes('/inquiry'),
					icon: MessageSquare,
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
					href: '/admin/ems/employees',
					label: 'Employees & Accounts',
					active: pathname.includes('/admin/ems'),
					icon: UserSquareIcon,
					submenus: [],
				},
				{
					href: '/admin/customer',
					label: 'Customer',
					active: pathname.includes('/admin/customer'),
					icon: Users,
					submenus: [],
				},
				{
					href: '/admin/sales',
					label: 'Services & Sales',
					active: pathname.includes('/admin/sales'),
					icon: Tag,
					submenus: [
						{
							href: '/admin/sales/list',
							label: 'Sales',
							icon: LayoutGrid,
							active: pathname === '/admin/sales/list',
						},
						{
							href: '/admin/sales/services',
							label: 'Service',
							icon: LayoutGrid,
							active: pathname === '/admin/sales/services',
						},
						{
							href: 'admin/sales/payments',
							label: 'Payments',
							icon: LayoutGrid,
							active: pathname === '/admin/sales/payments',
						},
					],
				},
				{
					href: '/admin/inventory/products',
					label: 'Inventory',
					active: pathname.includes('/admin/inventory/products'),
					icon: ShoppingBag,
					submenus: [
						{
							href: '/admin/inventory/products',
							label: 'Products',
							icon: BoxIcon,
							active: pathname === '/admin/inventory/products',
						},
						{
							href: '/admin/inventory/orders',
							label: 'Orders',
							icon: BoxesIcon,
							active: pathname === '/admin/inventory/orders',
						},
						{
							href: '/admin/inventory/suppliers',
							label: 'Supplier',
							icon: Users,
							active: pathname === '/admin/inventory/suppliers',
						},
					],
				},
			],
		},
	];
}

export function getSalesMenuList(pathname: string): Group[] {
	return [
		{
			groupLabel: '',
			menus: [
				{
					href: '/sales/dashboard',
					label: 'Dashboard',
					active: pathname.includes('/sales/dashboard'),
					icon: LayoutGrid,
					submenus: [],
				},
				{
					href: '/admin/inquiry',
					label: 'Inquiry',
					active: pathname.includes('/inquiry'),
					icon: MessageSquare,
					submenus: [],
				},
			],
		},
		{
			groupLabel: 'Systems',
			menus: [
				{
					href: '/sales/overview',
					label: 'Overview',
					active: pathname === '/sales/overview',
					icon: LayoutPanelLeft,
					submenus: [],
				},
				{
					href: '/sales/system',
					label: 'Services & Sales',
					active: pathname.includes('sales/system'),
					icon: Tag,
					submenus: [
						{
							href: '/sales/system/list',
							label: 'Sales',
							icon: LayoutGrid,
							active: pathname === '/sales/system/list',
						},
						{
							href: '/sales/system/services',
							label: 'Service',
							icon: LayoutGrid,
							active: pathname === '/sales/system/services',
						},
						{
							href: '/sales/system/payment',
							label: 'Payments',
							icon: LayoutGrid,
							active: pathname === '/sales/system/payment',
						},
					],
				},
				{
					href: '/sales/inventory/products',
					label: 'Inventory',
					active: pathname.includes('/admin/inventory/products'),
					icon: ShoppingBag,
					submenus: [
						{
							href: '/sales/inventory/products',
							label: 'Products',
							icon: LayoutGrid,
							active: pathname === '/sales/inventory/products',
						},
						{
							href: '/sales/inventory/products/orders',
							label: 'Orders',
							icon: LayoutGrid,
							active: pathname === '/sales/inventory/orders',
						},
						{
							href: '/sales/inventory/products/suppliers',
							label: 'Supplier',
							icon: LayoutGrid,
							active: pathname === '/sales/inventory/suppliers',
						},
					],
				},
				{
					href: '/sales/customer',
					label: 'Customer',
					active: pathname.includes('/sales/customer'),
					icon: Users,
					submenus: [],
				},
				{
					href: '/sales/inquiry',
					label: 'Inquiries',
					active: pathname.includes('/sales/inquiry'),
					icon: PackageOpenIcon,
					submenus: [],
				},
			],
		},
		{
			groupLabel: 'Settings',
			menus: [
				// {
				// 	href: '/sales/terminal',
				// 	label: 'Terminal',
				// 	active: pathname.includes('/sales/terminal'),
				// 	icon: Terminal,
				// 	submenus: [],
				// },
				{
					href: '/sales/settings',
					label: 'Settings',
					active: pathname.includes('/sales/settings'),
					icon: Settings,
					submenus: [],
				},
			],
		},
	];
}

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
				{
					href: '/admin/inquiry',
					label: 'Inquiry',
					active: pathname.includes('/inquiry'),
					icon: MessageSquare,
					submenus: [],
				},
			],
		},
		{
			groupLabel: 'Systems',
			menus: [
				{
					href: '/tech/overview',
					label: 'Overview',
					active: pathname === '/tech/overview',
					icon: LayoutPanelLeft,
					submenus: [],
				},
				{
					href: '/tech/services/joborders',
					label: 'Joborder Service',
					active: pathname.includes('/tech/services/joborders'),
					icon: Package,
					submenus: [],
				},
				{
					href: '/tech/customer',
					label: 'Customer Database',
					active: pathname.includes('/tech/customer'),
					icon: Users,
					submenus: [],
				},
				{
					href: '/tech/inventory/products',
					label: 'Products',
					active: pathname.includes('/admin/inventory/products'),
					icon: ShoppingBag,
					submenus: [],
				},
				{
					href: '/tech/inquiry',
					label: 'Inquiries',
					active: pathname.includes('/tech/inquiry'),
					icon: BotMessageSquareIcon,
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
				// {
				// 	href: '/admin/activity',
				// 	label: 'Activity',
				// 	active: pathname.includes('/activity'),
				// 	icon: Network,
				// 	submenus: [
				// 		{
				// 			href: '/admin/activity/overview',
				// 			label: 'Overview',
				// 			active: pathname === '/admin/activity/overview',
				// 		},
				// 		{
				// 			href: '/admin/activity/attendance',
				// 			label: 'Attendance',
				// 			active: pathname === '/admin/activity/attendance',
				// 		},
				// 		{
				// 			href: '/admin/activity/interchat',
				// 			label: 'Chat',
				// 			active: pathname === '/activity/chat',
				// 		},
				// 	],
				// },
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
