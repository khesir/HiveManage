import {Button} from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {Separator} from '@/components/ui/separator';
import {dateParser} from '@/lib/util/utils';
import {File} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import useOrderStore from '../_components/hooks/use-orders';
import {Badge} from '@/components/ui/badge';

export function OrderProfile() {
	const navigate = useNavigate();
	const {data} = useOrderStore();
	if (!data) {
		return (
			<Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
				<CardHeader className="flex flex-row items-start bg-muted/50">
					Not Found
				</CardHeader>
			</Card>
		);
	}
	return (
		<Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
			<CardHeader className="flex flex-row items-start bg-muted/50">
				<div className="grid gap-0.5">
					<CardTitle className="group flex items-center gap-2 text-lg">
						{`Order #${data.order_id}`}
					</CardTitle>
					{data && (
						<CardDescription>
							Expected Arrival: {dateParser(data.expected_arrival ?? '')}
						</CardDescription>
					)}
				</div>
				<div className="ml-auto flex items-center gap-1">
					<Button
						size="sm"
						variant="outline"
						className="h-8 gap-1"
						onClick={() => {
							navigate(`view/${data.order_id}`);
						}}
					>
						<File className="h-3.5 w-3.5" />
						<span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
							View More
						</span>
					</Button>
					{/* <DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								size="icon"
								variant="outline"
								className="h-8 w-8"
								onClick={() => navigate(`view/${data.customer_id}`)}
							>
								<MoreVertical className="h-3.5 w-3.5" />
								<span className="sr-only">More</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem>Edit</DropdownMenuItem>
							<DropdownMenuItem>Export</DropdownMenuItem>
							<DropdownMenuSeparator />
															<DropdownMenuItem>Trash</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu> */}
				</div>
			</CardHeader>
			<CardContent className="p-6 text-sm">
				<div className="grid gap-3">
					<div className="font-semibold">Information</div>
					<ul className="grid gap-3">
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Supplier</span>
							<span>{data.supplier?.name}</span>
						</li>{' '}
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Relationship</span>
							<span>{data.supplier?.relationship}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Contact</span>
							<span>{data.supplier?.contact_number}</span>
						</li>
					</ul>
				</div>
				<Separator className="my-4" />
				<div>
					<ul className="grid gap-3">
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Order Status</span>
							<Badge>{data.order_status}</Badge>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Payment Method</span>
							<span>{data.order_payment_method}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Payment Status</span>
							<span>{data.order_payment_status}</span>
						</li>
					</ul>
				</div>
				<Separator className="my-4" />
				<div>
					<ul className="grid gap-3">
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Order qty</span>
							<span>
								{data.order_products?.length === 0
									? 'No item'
									: `${data.order_products?.reduce((sum, product) => sum + (product.total_quantity || 0), 0)} items`}
							</span>
						</li>
						<li className="flex items-start flex-col gap-1">
							<span className="text-muted-foreground">Note</span>
							<span>{data.notes}</span>
						</li>
					</ul>
				</div>
			</CardContent>
		</Card>
	);
}
