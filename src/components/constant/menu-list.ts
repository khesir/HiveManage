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
	BotMessageSquareIcon,
	Package,
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
							href: '/admin/sales/dashboard',
							label: 'Overview',
							active: pathname === '/admin/sales/overview',
						},
						{
							href: '/admin/sales/services',
							label: 'Services & Sales',
							active: pathname === '/admin/sales/services',
						},
						{
							href: '/admin/sales/customer',
							label: 'Customer Database',
							active: pathname === '/admin/sales/customer',
						},
						{
							href: '/admin/sales/inquiry',
							label: 'Inquiries',
							active: pathname === '/admin/sales/inquiry',
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
							href: '/admin/inventory/overview',
							label: 'Overview',
							active: pathname === '/admin/inventory/overview',
						},
						{
							href: '/admin/inventory/items',
							label: 'Items & Products',
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
					href: '/admin/terminal',
					label: 'Terminal',
					active: pathname.includes('/admin/terminal'),
					icon: Terminal,
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
					href: '/sales/overview',
					label: 'Overview',
					active: pathname === '/sales/overview',
					icon: LayoutPanelLeft,
					submenus: [],
				},
				{
					href: '/sales/services',
					label: 'Business Service',
					active: pathname.includes('/sales/services'),
					icon: PackageOpenIcon,
					submenus: [
						{
							href: '/sales/services/sales',
							label: 'Sales',
							active: pathname === '/sales/services/sales',
						},
						{
							href: '/sales/services/joborders',
							label: 'Joborder',
							active: pathname === '/sales/services/joborders',
						},
						{
							href: '/sales/services/borrow',
							label: 'Borrow',
							active: pathname === '/sales/services/borrow',
						},
						{
							href: '/sales/services/reservation',
							label: 'Reservation',
							active: pathname === '/sales/services/reservation',
						},
					],
				},
				{
					href: '/sales/customer',
					label: 'Customer Service',
					active: pathname.includes('/sales/customer'),
					icon: Users,
					submenus: [
						{
							href: '/sales/customer/overview',
							label: 'Customer Database',
							active: pathname === '/sales/services/overview',
						},
						{
							href: '/sales/customer/payments',
							label: 'Payments History',
							active: pathname === '/sales/customer/payments',
						},
						{
							href: '/sales/customer/inquiry',
							label: 'Customer Inquiries',
							active: pathname === '/sales/customer/inquiry',
						},
					],
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
					href: '/tech/chat',
					label: 'Chat',
					active: pathname === '/tech/chat',
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
					submenus: [
						{
							href: '/tech/services/joborders',
							label: 'Joborders',
							active: pathname === '/tech/services/joborders',
						},
						{
							href: '/tech/services/joborders/tasks',
							label: 'Tickets',
							active: pathname === '/tech/services/joborders/tasks',
						},
						{
							href: '/tech/services/joborders/reports',
							label: 'Reports',
							active: pathname === '/tech/services/joborders/reports',
						},
					],
				},
				{
					href: '/tech/customer',
					label: 'Customer Database',
					active: pathname.includes('/tech/customer'),
					icon: Users,
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
				{
					href: '/tech/terminal',
					label: 'Terminal',
					active: pathname.includes('/terminal'),
					icon: Terminal,
					submenus: [],
				},
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
