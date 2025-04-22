import {Card} from '@/components/ui/card';
import {Separator} from '@/components/ui/separator';
import {Banknote, BoxIcon, Coins, Scroll} from 'lucide-react';
import {DashboardCard} from '../dashboard/dashboard-card';

export default function DasboardSection() {
	const dashboardData = [
		{
			title: 'Services',
			icon: Scroll,
			duration: 'Today',
			count: 'x pending',
		},
		{
			title: 'Sales',
			icon: Banknote,
			duration: 'Today',
			count: 'x completed',
		},
		{
			title: 'Orders',
			icon: BoxIcon,
			duration: 'Today',
			count: 'x incoming',
		},
		{
			title: 'Revenue',
			icon: Coins,
			duration: 'Today',
			count: 'P 10000',
		},
	];
	// Get first 10 page logging service and sales
	// Get user logging
	return (
		<div className="flex flex-col sm:gap-4">
			<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
				{/* Employee List */}

				<div className="grid items-start auto-rows-max gap-4 gap md:gap-6 lg:col-span-2">
					<div className="flex gap-4 justify-between w-full h-[25vh]">
						{dashboardData.map((d, index) => (
							<DashboardCard key={index} {...d} />
						))}
					</div>
					<div className="flex gap-4 justify-between">
						<Card className="flex-[50%]">Test</Card>
						<Card className="flex-[50%]">Test</Card>
					</div>
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex lg:hidden">
						<Separator />
					</div>
					{/* Service Profile */}
					<Card>Test</Card>
				</div>
			</div>
		</div>
	);
}
