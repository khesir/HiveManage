import {Badge} from '@/components/ui/badge';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Separator} from '@/components/ui/separator';
import {Sales} from '@/components/validation/sales';

interface Props {
	data: Sales;
}
export function SalesInfoCard({data}: Props) {
	return (
		<Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
			<CardHeader className="flex flex-row items-start bg-muted/50">
				<div className="grid gap-0.5">
					<CardTitle className="group flex items-center gap-2 text-lg">
						{`#${data.sales_id} - ${data.customer?.firstname} ${data.customer?.middlename} ${data.customer?.lastname}`}
					</CardTitle>
					{data.created_at ? new Date(data.created_at).toLocaleString() : 'N/A'}
				</div>
			</CardHeader>
			<CardContent className="p-6 text-sm">
				<div className="grid gap-3">
					<div className="font-semibold">Information</div>
					<ul className="grid gap-3">
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Status</span>
							<span>
								<Badge>{data.status}</Badge>
							</span>
						</li>{' '}
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Quantity Sold</span>
							<span>{data.product_sold}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Total Price</span>
							<span>{data.total_price}</span>
						</li>
					</ul>
				</div>
				<Separator className="my-4" />
				<div>
					<ul className="grid gap-3">
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Payment Transaction</span>
							<span>10</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Handled By</span>
							<span>{`${data.employee?.firstname} ${data.employee?.middlename} ${data.employee?.lastname}`}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Payment Method</span>
							<span>{data.payment?.payment_method}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Payment Type</span>
							<span>{data.payment?.payment_type}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Discount Amount</span>
							<span>{data.payment?.discount_amount}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Ref #</span>
							<span>
								{data.payment?.reference_number
									? data.payment?.reference_number
									: 'No # provided'}
							</span>
						</li>
					</ul>
				</div>
			</CardContent>
		</Card>
	);
}
