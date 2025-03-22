import {useEffect} from 'react';
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
import useLoalOrderStore from '@/modules/inventory/_components/hooks/use-orders';
import useOrderStore from '@/api/order';
import {useParams} from 'react-router-dom';

export default function OrderInformationProfile() {
	const {id} = useParams();
	const {data, setOrder} = useLoalOrderStore();
	const {getOrderById, loading} = useOrderStore();
	useEffect(() => {
		const fetchData = async () => {
			if (id) {
				const data = await getOrderById(Number(id));
				if (data) {
					setOrder(data);
				}
			}
		};
		fetchData();
	}, []);

	if (loading) {
		return <div>skeleton loading here</div>;
	}
	if (data === undefined || data === null) {
		return <div>No record found or something went wrong</div>;
	}
	return (
		<div className="flex col sm:gap-4">
			<div>
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
									<span className="text-muted-foreground">Order value</span>
									<span>{data.order_value}</span>
								</li>
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
											: data.order_products?.length === 1
												? '1 item'
												: `${data.order_products?.length} items`}
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
			</div>
		</div>
	);
}
