import {AvatarCircles} from '@/components/ui/avatarcircles';
import {Button} from '@/components/ui/button';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import {Bell, MoreVertical} from 'lucide-react';
import {useNavigate} from 'react-router-dom';

export function OrderControls() {
	const navigate = useNavigate();
	return (
		<div className="flex gap-2">
			<Button className="flex-1" onClick={() => navigate('create')}>
				Create Purchase Order
			</Button>
			<DropdownMenu>
				<DropdownMenuTrigger>
					<Button size={'icon'}>
						<MoreVertical />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<Button variant={'ghost'}>View All Orders</Button>
				</DropdownMenuContent>
			</DropdownMenu>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<Button size={'icon'}>
							<Bell />
						</Button>
					</TooltipTrigger>
					<TooltipContent className="flex flex-col gap-5">
						<p className="text-lg">Recent Activity</p>
						<Card>
							<CardHeader className="flex gap-2 flex-row p-2 m-0">
								<AvatarCircles avatar={[{link: '#', name: 'placeholder'}]} />
								<div>
									<div className="flex gap-3">
										<CardTitle className="text-sm">
											Arrived Product # 1
										</CardTitle>
										<p className="p-0 m-0">Date: November 11 2024</p>
									</div>
									<CardDescription>
										Item has arrived and now approved by the sales manager
									</CardDescription>
								</div>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader className="flex gap-2 flex-row p-2 m-0">
								<AvatarCircles avatar={[{link: '#', name: 'placeholder'}]} />
								<div>
									<div className="flex gap-3">
										<CardTitle className="text-sm">
											Arrived Product # 1
										</CardTitle>
										<p className="p-0 m-0">Date: November 11 2024</p>
									</div>
									<CardDescription>
										Item has arrived and now approved by the sales manager
									</CardDescription>
								</div>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader className="flex gap-2 flex-row p-2 m-0">
								<AvatarCircles avatar={[{link: '#', name: 'placeholder'}]} />
								<div>
									<div className="flex gap-3">
										<CardTitle className="text-sm">
											Arrived Product # 1
										</CardTitle>
										<p className="p-0 m-0">Date: November 11 2024</p>
									</div>
									<CardDescription>
										Item has arrived and now approved by the sales manager
									</CardDescription>
								</div>
							</CardHeader>
						</Card>
						<Button variant={'outline'}>View more</Button>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
}
