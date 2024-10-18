import {
	Tag,
	Users,
	Settings,
	LayoutGrid,
	LucideIcon,
	PackageOpenIcon,
	Terminal,
	Network,
	LayoutPanelLeft,
	MessageSquare,
} from 'lucide-react';

type Submenu = {
	href: string;
	label: string;
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
					href: '/admin/activity',
					label: 'Activity',
					active: pathname.includes('/activity'),
					icon: Network,
					submenus: [
						{
							href: '/admin/activity/overview',
							label: 'Overview',
							active: pathname === '/admin/activity/overview',
						},
						{
							href: '/admin/activity/attendance',
							label: 'Attendance',
							active: pathname === '/admin/activity/attendance',
						},
						{
							href: '/admin/activity/interchat',
							label: 'Chat',
							active: pathname === '/activity/chat',
						},
					],
				},
			],
		},
		{
			groupLabel: 'Systems',
			menus: [
				{
					href: '/admin/ems',
					label: 'EMS',
					active: pathname.includes('/admin/ems'),
					icon: Users,
					submenus: [
						{
							href: '/admin/ems/overview',
							label: 'Overview',
							active: pathname === '/admin/ems/overview',
						},
						{
							href: '/admin/ems/employees',
							label: 'Employees',
							active: pathname === '/admin/ems/employees',
						},
						{
							href: '/admin/ems/payroll',
							label: 'Payroll',
							active: pathname === '/admin/ems/payroll',
						},
						{
							href: '/admin/ems/leave',
							label: 'Leave Requests',
							active: pathname === '/admin/leave',
						},
					],
				},
				{
					href: '/admin/sales',
					label: 'Sales',
					active: pathname.includes('/admin/sales'),
					icon: Tag,
					submenus: [
						{
							href: '/admin/sales/overview',
							label: 'Overview',
							active: pathname === '/admin/sales/overview',
						},
						{
							href: '/admin/sales/services',
							label: 'Services',
							active: pathname === '/admin/sales/services',
						},
					],
				},
				{
					href: '/admin/inventory',
					label: 'Inventory',
					active: pathname.includes('/admin/inventory'),
					icon: PackageOpenIcon,
					submenus: [
						{
							href: '/inventory/overview',
							label: 'Overview',
							active: pathname === '/inventory/overview',
						},
						{
							href: '/admin/inventory/items',
							label: 'Items',
							active: pathname === '/admin/inventory/items',
						},
						{
							href: '/admin/inventory/orders',
							label: 'Orders',
							active: pathname === '/admin/inventory/orders',
						},
					],
				},
			],
		},
		{
			groupLabel: 'Settings',
			menus: [
				{
					href: '/terminal',
					label: 'Terminal',
					active: pathname.includes('/terminal'),
					icon: Terminal,
					submenus: [],
				},
				{
					href: '/setting',
					label: 'Settings',
					active: pathname.includes('/settings'),
					icon: Settings,
					submenus: [],
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
					href: '/sales/activity/interchat',
					label: 'Chat',
					active: pathname === '/activity/chat',
					icon: MessageSquare,
					submenus: [],
				},
			],
		},
		{
			groupLabel: 'Systems',
			menus: [
				{
					href: '/sales',
					label: 'Overview',
					active: pathname === '/sales',
					icon: LayoutPanelLeft,
					submenus: [],
				},
				{
					href: '/sales/sales-list',
					label: 'Sales',
					active: pathname.includes('/sales/sales-list'),
					icon: PackageOpenIcon,
					submenus: [],
				},
				{
					href: '/sales/services-list',
					label: 'Service',
					active: pathname.includes('/sales/services-list'),
					icon: PackageOpenIcon,
					submenus: [],
				},
				{
					href: '/sales/customer',
					label: 'Customer Database',
					active: pathname.includes('/sales/customer'),
					icon: Users,
					submenus: [],
				},
			],
		},
		{
			groupLabel: 'Settings',
			menus: [
				{
					href: '/sales/terminal',
					label: 'Terminal',
					active: pathname.includes('/sales/terminal'),
					icon: Terminal,
					submenus: [],
				},
				{
					href: '/sales/setting',
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
					active: pathname.includes('/admin/dashboard'),
					icon: LayoutGrid,
					submenus: [],
				},
				{
					href: '/admin/activity',
					label: 'Activity',
					active: pathname.includes('/activity'),
					icon: Network,
					submenus: [
						{
							href: '/admin/activity/overview',
							label: 'Overview',
							active: pathname === '/admin/activity/overview',
						},
						{
							href: '/admin/activity/attendance',
							label: 'Attendance',
							active: pathname === '/admin/activity/attendance',
						},
						{
							href: '/admin/activity/interchat',
							label: 'Chat',
							active: pathname === '/activity/chat',
						},
					],
				},
			],
		},
		{
			groupLabel: 'Systems',
			menus: [
				{
					href: '/tech/inventory',
					label: 'Job Order',
					active: pathname.includes('/admin/inventory'),
					icon: PackageOpenIcon,
					submenus: [
						{
							href: '/inventory/overview',
							label: 'Overview',
							active: pathname === '/inventory/overview',
						},
						{
							href: '/admin/inventory/items',
							label: 'Items',
							active: pathname === '/admin/inventory/items',
						},
						{
							href: '/admin/inventory/orders',
							label: 'Orders',
							active: pathname === '/admin/inventory/orders',
						},
					],
				},
			],
		},
		{
			groupLabel: 'Settings',
			menus: [
				{
					href: '/tech/terminal',
					label: 'Terminal',
					active: pathname.includes('/terminal'),
					icon: Terminal,
					submenus: [],
				},
				{
					href: '/tech/setting',
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
				{
					href: '/admin/activity',
					label: 'Activity',
					active: pathname.includes('/activity'),
					icon: Network,
					submenus: [
						{
							href: '/admin/activity/overview',
							label: 'Overview',
							active: pathname === '/admin/activity/overview',
						},
						{
							href: '/admin/activity/attendance',
							label: 'Attendance',
							active: pathname === '/admin/activity/attendance',
						},
						{
							href: '/admin/activity/interchat',
							label: 'Chat',
							active: pathname === '/activity/chat',
						},
					],
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
