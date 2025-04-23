import {Banknote, BoxIcon, Coins, Scroll} from 'lucide-react';
import {DashboardCard} from '../dashboard/dashboard-card';
import {LogsTabOrder} from '@/modules/inventory/order/view/logsRecord/logs-tab';
import {LogsTabProduct} from '@/modules/inventory/products/view/logsRecord/logs-tab';

export default function DasboardSection() {
	const dashboardData = [
		{
			title: 'Services',
			icon: Scroll,
			duration: 'Today',
			count: '1 pending',
		},
		{
			title: 'Sales',
			icon: Banknote,
			duration: 'Today',
			count: '1 completed',
		},
		{
			title: 'Orders',
			icon: BoxIcon,
			duration: 'Today',
			count: '1 incoming',
		},
		{
			title: 'Revenue',
			icon: Coins,
			duration: 'Today',
			count: '10000',
		},
	];
	// Get first 10 page logging service and sales
	// Get user logging
	return (
		<div className="flex flex-col sm:gap-4">
			<div className="grid items-start auto-rows-max gap-4 gap md:gap-6 lg:col-span-2">
				<div className="grid grid-cols-4 gap-4 w-full h-[25vh]">
					{dashboardData.map((d, index) => (
						<DashboardCard key={index} {...d} />
					))}
				</div>
				<div className="flex gap-4 justify-between">
					<div className="flex-[50%]">
						<LogsTabOrder />
					</div>
					<div className="flex-[50%]">
						<LogsTabProduct />
					</div>
				</div>
			</div>
		</div>
	);
}
