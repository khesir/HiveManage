import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {OrderWithDetails} from '../_components/validation/order';
import {Separator} from '@/components/ui/separator';
import {dateParser} from '@/lib/util/utils';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Badge} from '@/components/ui/badge';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Button} from '@/components/ui/button';
import useOrderStore from '../_components/hooks/use-orders';
import {toast} from 'sonner';
import {AxiosError} from 'axios';

interface ProfileProps {
	data: OrderWithDetails | undefined;
}

export function OrderProfile({data}: ProfileProps) {
	const {setOrder} = useOrderStore();

	const orderStatus = [
		'Pending',
		'Processing',
		'Delivered',
		'Cancelled',
		'Return',
		'Shipped',
		'Verification',
		'Moved to Inventory',
	];
	const handleStatus = async (status: string) => {
		try {
			if (data) {
				data.status = status;
				// Process data
				setOrder(data);
				toast.success('Order Status Changed');
			} else {
				toast.error('Order Data not set');
			}
		} catch (error) {
			console.log(error);
			toast.error((error as AxiosError).response?.data as string);
		}
	};
	return (
		<Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
			<CardContent className="p-6 text-sm">
				<div className="grid gap-3">
					<div className="font-semibold">Information</div>
					<ul className="grid gap-3">
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Supplier name</span>
							<span>{data?.supplier?.name}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Contact</span>
							<span>{data?.supplier?.contact_number}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Order Status</span>
							<DropdownMenu>
								<DropdownMenuTrigger>
									<Badge className="cursor-pointer">{data?.status}</Badge>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="flex flex-col gap-2">
									{orderStatus.map((status, index) => (
										<Button
											key={index}
											variant={status !== data?.status ? 'ghost' : 'default'}
											size={'xs'}
											onClick={() => handleStatus(status)}
										>
											{status}
										</Button>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Value</span>
							<span>{data?.ordered_value}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Expected Arrival</span>
							<span>{dateParser(data?.expected_arrival ?? '')}</span>
						</li>
					</ul>
				</div>

				<Separator className="my-4" />
				<div className="grid gap-3 ">
					<div className="font-semibold">Logs</div>
					<ScrollArea className="h-[200px]">
						{data?.messages.map((msg, index) => (
							<div key={index} className="flex items-center">
								<p className="pl-5 flex-1">
									{dateParser(msg.created_at ?? '')}
								</p>
								<CardHeader className="">
									<div className="border-l-2 pl-2">
										<CardTitle className="text-sm">{msg.title}</CardTitle>
										<CardDescription>{msg.message}</CardDescription>
									</div>
								</CardHeader>
							</div>
						))}
					</ScrollArea>
				</div>
			</CardContent>
		</Card>
	);
}
