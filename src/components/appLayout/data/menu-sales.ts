import {
	Tag,
	Users,
	LayoutGrid,
	LucideIcon,
	ShoppingBag,
	BoxesIcon,
	BoxIcon,
	Banknote,
	ScrollText,
	ShoppingCart,
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

export function getSalesMenuList(pathname: string): Group[] {
	return [
		{
			groupLabel: '',
			menus: [
				{
					href: '/sales/dashboard',
					label: 'Point of Sale',
					active: pathname.includes('/sales/dashboard'),
					icon: LayoutGrid,
					submenus: [],
				},
				// {
				// 	href: '/admin/settings',
				// 	label: 'Settings',
				// 	active: pathname.includes('/admin/settings'),
				// 	icon: Settings,
				// 	submenus: [],
				// },
			],
		},
		{
			groupLabel: 'Systems',
			menus: [
				{
					href: '/sales/system/sales',
					label: 'Services & Sales',
					active: pathname.includes('sales/system/sales'),
					icon: Tag,
					submenus: [
						{
							href: '/sales/system/sales/list',
							label: 'Sales',
							icon: ShoppingCart,
							active: pathname === '/sales/system/sales/list',
						},
						{
							href: '/sales/system/sales/services',
							label: 'Service',
							icon: ScrollText,
							active: pathname === '/sales/system/sales/services',
						},
						{
							href: '/sales/system/sales/payment',
							label: 'Payments',
							icon: Banknote,
							active: pathname === '/sales/system/sales/payment',
						},
					],
				},
				{
					href: '/sales/system/inventory/',
					label: 'Inventory',
					active: pathname.includes('/sales/system/inventory/products'),
					icon: ShoppingBag,
					submenus: [
						{
							href: '/sales/system/inventory/products',
							label: 'Products',
							icon: BoxIcon,
							active: pathname === '/sales/system/inventory/products',
						},
						{
							href: '/sales/system/inventory/orders',
							label: 'Orders',
							icon: BoxesIcon,
							active: pathname === '/sales/system/inventory/orders',
						},
						{
							href: '/sales/system/inventory/suppliers',
							label: 'Supplier',
							icon: Users,
							active: pathname === '/sales/system/inventory/suppliers',
						},
					],
				},
				{
					href: '/sales/system/customer',
					label: 'Customer',
					active: pathname.includes('/sales/system/customer'),
					icon: Users,
					submenus: [],
				},
			],
		},
	];
}
