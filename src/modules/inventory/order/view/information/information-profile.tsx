import {Separator} from '@/components/ui/separator';

import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from '@/components/ui/card';
import {dateParser} from '@/lib/util/utils';
import {Badge} from '@/components/ui/badge';
import useOrderStore from '@/api/order-state';

export default function OrderInformationProfile() {
	const {selectedOrder, loading} = useOrderStore();

	if (loading) {
		return <div>Skeleton loading</div>;
	}
	return (
		<div className="w-full flex-col sm:gap-4">
			<div>
				<Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
					<CardHeader className="flex flex-row items-start bg-muted/50">
						<div className="grid gap-0.5">
							<CardTitle className="group flex items-center gap-2 text-lg">
								{`Order #${selectedOrder.order_id}`}
							</CardTitle>
							{selectedOrder && (
								<CardDescription>
									Expected Arrival:{' '}
									{selectedOrder.expected_arrival
										? dateParser(selectedOrder.expected_arrival)
										: 'Invalid date'}
								</CardDescription>
							)}
						</div>
					</CardHeader>
					<CardContent className="p-6 text-sm">
						<div className="grid gap-3">
							<div className="font-semibold">Information</div>
							<ul className="grid gap-3">
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Supplier</span>
									<span>{selectedOrder.supplier?.name}</span>
								</li>{' '}
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Relationship</span>
									<span>{selectedOrder.supplier?.relationship}</span>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Contact</span>
									<span>{selectedOrder.supplier?.contact_number}</span>
								</li>
							</ul>
						</div>
						<Separator className="my-4" />
						<div>
							<ul className="grid gap-3">
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Order value</span>
									<span>
										{selectedOrder.order_products?.reduce(
											(sum, pOrder) =>
												sum +
												(pOrder.total_quantity || 0) *
													Number(pOrder.cost_price || 0),
											0,
										)}
									</span>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Order Status</span>
									<Badge>{selectedOrder.order_status}</Badge>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Payment Method</span>
									<span>{selectedOrder.order_payment_method}</span>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Payment Status</span>
									<span>{selectedOrder.order_payment_status}</span>
								</li>
							</ul>
						</div>
						<Separator className="my-4" />
						<div>
							<ul className="grid gap-3">
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Order qty</span>
									<span>
										{selectedOrder.order_products?.length === 0
											? 'No item'
											: selectedOrder.order_products?.length === 1
												? '1 item'
												: `${selectedOrder.order_products?.length} items`}
									</span>
								</li>
								<li className="flex items-start flex-col gap-1">
									<span className="text-muted-foreground">Note</span>
									<span>{selectedOrder.notes}</span>
								</li>
							</ul>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
