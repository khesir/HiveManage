import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from '@/components/ui/card';
import {ScrollArea} from '@/components/ui/scroll-area';
import {OrderWithDetails} from '../_components/validation/order';
import useOrderItemStore from '../_components/hooks/use-order-items';
import {Badge} from '@/components/ui/badge';
import {AddProductForm} from './modal/add-order-products';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import {OrderTrackingView} from './order-tracking-view';

import {useEffect, useState} from 'react';
import {ProductCard} from '../products/card/product-card';
import {Checkbox} from '@/components/ui/checkbox';
import {ProductWithRelatedTables} from '../_components/validation/product';

interface ProfileProps {
	data: OrderWithDetails | undefined;
}

export function OrderItems({data}: ProfileProps) {
	const {orderItem, setOrderItem} = useOrderItemStore();
	const [selectedProducts, setSelectedProducts] = useState<
		ProductWithRelatedTables[]
	>([]);

	useEffect(() => {
		if (data && data.order_item) {
			setOrderItem(data.order_item[0]);
		}
	}, [data]);
	const handleCheckboxChange = (
		product: ProductWithRelatedTables,
		isChecked: boolean,
	) => {
		setSelectedProducts(
			(prev) =>
				isChecked
					? [...prev, product] // Add product if checked
					: prev.filter((item) => item.product_id !== product.product_id), // Remove product if unchecked
		);
	};
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
	console.log(selectedProducts);
	return (
		<div className="flex gap-5 w-full h-full">
			<div className="flex-0 flex flex-col justify-between gap-2 h-full">
				<div className="space-y-5">
					<div className="flex items-center justify-between">
						<p className="text-lg font-semibold">Ordered Products</p>
					</div>
					<ScrollArea className="px-2">
						<div className="space-y-2">
							{data?.order_item?.map((item) => (
								<TooltipProvider key={item.product_id}>
									<Tooltip>
										<TooltipTrigger>
											<Card
												className="cursor-pointer w-[20vh]"
												onClick={() => setOrderItem(item)}
											>
												<CardHeader className="flex gap-2 flex-row justify-between p-2 m-0">
													<div className="flex flex-col items-start w-full">
														<div className="flex gap-3 justify-between w-full items-center">
															<CardTitle className="text-sm">
																{`#${item.orderItem_id} - ${item.product.name}`}
															</CardTitle>

															{item.status === 'Delivered' ||
																(item.status === 'Partially Delivered' && (
																	<Checkbox
																		onCheckedChange={(isChecked) =>
																			handleCheckboxChange(
																				item.product,
																				!!isChecked,
																			)
																		}
																	/>
																))}
														</div>
														<div>
															<Badge>{item.status}</Badge>
														</div>
													</div>
												</CardHeader>
												<CardContent className="flex flex-col items-start text-sm py-0 px-2 m-0 ">
													<CardDescription>
														<p>{`Qty: ${item.quantity}`}</p>
													</CardDescription>
													<CardDescription>
														{' '}
														<p>{`Unit Price: ${item.price}`}</p>
													</CardDescription>
													<CardDescription className="text-sm">{`Price: ${item.price * item.quantity}`}</CardDescription>
												</CardContent>
											</Card>
										</TooltipTrigger>
										<TooltipContent side="right" className="w-[50vh]">
											<ProductCard data={item.product} />
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							))}
						</div>
					</ScrollArea>
				</div>
				<AddProductForm data={data} />
			</div>
			<div className="flex-1 w-full">
				{orderItem ? (
					<OrderTrackingView data={orderItem} />
				) : (
					<p>Render Something else</p>
				)}
			</div>
		</div>
	);
}
