import {Banknote, FileSymlinkIcon, UserPlus, Users} from 'lucide-react';

export const employeeSidebar = [
	{
		title: 'Employee',
		href: '/employee/users',
		label: '1',
		icon: Users,
		variant: 'ghost',
	},
	{
		title: 'Leave Request',
		href: '/leave-request',
		label: '1',
		icon: FileSymlinkIcon,
		variant: 'ghost',
	},
	{
		title: 'Payroll',
		href: '/employee/payroll',
		label: '1',
		icon: Banknote,
		variant: 'ghost',
	},
	{
		title: 'Service Requests',
		href: '/services/requests',
		label: '1',
		icon: UserPlus,
		variant: 'ghost',
	},
];

export const SalesSidebar = [
	{
		title: 'Sales',
		href: '/sales/shop',
		icon: Users,
		variant: 'ghost',
	},
	{
		title: 'Services',
		href: '/sales/services',
		icon: Users,
		variant: 'ghost',
	},
	{
		title: 'Metrics',
		href: '/sales/metrics',
		icon: Users,
		variant: 'ghost',
	},
];

export const InventorySidebar = [
	{
		title: 'Items',
		href: '/inventory/items',
		icon: Users,
		variant: 'ghost',
	},
	{
		title: 'Metrics',
		href: '/admin/employee',
		icon: Users,
		variant: 'ghost',
	},
	{
		title: 'Suppliers',
		href: '/admin/employee',
		icon: Users,
		variant: 'ghost',
	},
	{
		title: 'Orders',
		href: '/admin/employee',
		icon: Users,
		variant: 'ghost',
	},
];

export const Services = [
	{
		name: 'Borrow',
		description: 'Borrow 1 Take 2',
		fee: 100,
		status: 'Active',
	},
	{
		name: 'Reserve',
		description: 'Reserve Item and get notified later',
		fee: 0,
		status: 'Active',
	},
	{
		name: 'Joborder',
		description: 'All tasks related to repairs, cleaning and moree',
		fee: 100,
		status: 'Active',
	},
];
