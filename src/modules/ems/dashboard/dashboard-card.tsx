import {Card} from '@/components/ui/card';
import {LucideIcon} from 'lucide-react';

export interface DashboardCardProps {
	title: string;
	icon: LucideIcon;
	duration: string;
	count: string;
}

export function DashboardCard({
	title,
	icon: Icon,
	duration,
	count,
}: DashboardCardProps) {
	return (
		<Card className="w-[25vh] h-full flex flex-col p-3 justify-between">
			<div className="flex flex-col gap-2">
				<div className="flex items-center">
					<div className="flex-[70%] text-lg font-semibold">{title}</div>
					<div className="flex-[30%] flex justify-end">
						<Icon />
					</div>
				</div>
				<div className="text-gray-500 text-sm">{duration}</div>
			</div>
			<div className="text-sm font-semibold">{count}</div>
		</Card>
	);
}
