import {AvatarCircles} from '@/components/ui/avatarcircles';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import {ScrollArea} from '@/components/ui/scroll-area';
import {OrderWithDetails} from '../_components/validation/order';
import useOrderItemStore from '../_components/hooks/use-order-items';
import {Badge} from '@/components/ui/badge';
import {AddProductForm} from './modal/add-order-products';

interface ProfileProps {
	data: OrderWithDetails | undefined;
}

export function OrderItems({data}: ProfileProps) {
	const {setOrderItem} = useOrderItemStore();
	if (!data) {
		return (
			<div className="flex-1 flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<p className="text-lg font-semibold">Ordered Products</p>
				</div>
				<Card>
					<CardHeader className="flex gap-2 flex-row justify-center p-2 m-0">
						<CardTitle className="text-sm">No Data provided</CardTitle>
					</CardHeader>
				</Card>
			</div>
		);
	}
	return (
		<div className="flex-1 flex flex-col gap-2">
			<div className="flex items-center justify-between">
				<p className="text-lg font-semibold">Ordered Products</p>
				<div>
					<AddProductForm data={data} />
				</div>
			</div>
			<ScrollArea className="h-[calc(90vh-210px)] px-2">
				<div className="space-y-2">
					{data?.order_item?.map((item) => (
						<Card
							key={item.product_id}
							className="cursor-pointer"
							onClick={() => setOrderItem(item)}
						>
							<CardHeader className="flex gap-2 flex-row justify-between p-2 m-0">
								<div className="flex flex-row gap-2">
									<AvatarCircles
										avatar={[
											{link: item.product.img_url, name: item.product.name},
										]}
									/>
									<div>
										<div className="flex gap-3 justify-between">
											<CardTitle className="text-sm">
												{`#${item.orderItem_id} - ${item.product.name}`}
											</CardTitle>
										</div>
										<CardDescription className="flex gap-5">
											<p>{`Qty: ${item.quantity}`}</p>
											<p className="p-0 m-0">{`Unit Price: ${item.price}`}</p>
										</CardDescription>
									</div>
								</div>
								<div className="flex flex-col justify-between">
									<CardDescription className="text-sm">{`Price: ${item.price * item.quantity}`}</CardDescription>

									<div>
										<Badge>{item.status}</Badge>
									</div>
								</div>
							</CardHeader>
						</Card>
					))}
				</div>
			</ScrollArea>
		</div>
	);
}
