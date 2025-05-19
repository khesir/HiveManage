import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card';

import {useEffect, useState} from 'react';
import {useParams, useSearchParams} from 'react-router-dom';

import {ApiRequest, PaginationResponse, request} from '@/api/axios';
import {Product} from '@/components/validation/product';
import {InformationCard} from './information-card';

import {ViewRecordTabs} from '../item-record-tabs';
import {CreatePODialogue} from '../../_components/dialogue/create-po-dialogue';
import {Order} from '@/components/validation/order';
import {OrderProduct} from '@/components/validation/order-product';

export function ProductInformationTab() {
	const [searchParams] = useSearchParams();
	const {id} = useParams();
	const [data, setData] = useState<Product>();
	const [currentOrder, setCurrentOrder] = useState<Order[]>([]);
	const [activeOrder, setActiveOrder] = useState<OrderProduct[]>([]);
	const fetchData = async () => {
		const [newProductData, orderData, orderProduct] = await Promise.all([
			request<ApiRequest<Product>>('GET', `/api/v1/ims/product/${id}`),
			request<PaginationResponse<Order>>(
				'GET',
				`/api/v1/ims/order/product?product_id=${id}&status=Draft`,
			),
			request<PaginationResponse<OrderProduct>>(
				'GET',
				`/api/v1/ims/order-product?product=${id}&status=Awaiting Arrival`,
			),
		]);

		if (!Array.isArray(newProductData.data)) {
			setData(newProductData.data);
		} else {
			setData(newProductData.data[0]);
		}
		if (orderData.data) {
			setCurrentOrder(orderData.data);
		} else {
			setCurrentOrder([]);
		}
		if (orderProduct) {
			setActiveOrder(
				orderProduct.data.filter((p) => p.product_id === Number(id)),
			);
		} else {
			setActiveOrder([]);
		}
	};
	useEffect(() => {
		fetchData();
	}, []);
	if (!data || !id) {
		return <Card>No products found</Card>;
	}

	return (
		<div className="flex flex-col sm:gap-4 max-w-full">
			<div className="w-full">
				{/* Product List */}
				<div className="flex gap-5 h-[300px] w-full">
					{/* First section: 30% */}
					<div className="relative h-full overflow-hidden rounded-md flex-[1_1_30%] min-w-[250px]">
						<img
							src={
								typeof data.img_url === 'string'
									? data.img_url
									: `/img/placeholder.jpg`
							}
							alt="Selected profile"
							className="object-cover h-full w-full"
						/>
					</div>

					{/* Middle section: 40% */}
					<div className="flex-[1_1_40%] min-w-[300px]">
						<InformationCard data={data} />
					</div>

					{/* Third section: 30% */}
					<div className="flex-[1_1_30%] min-w-[250px]">
						<Card className="flex flex-col lg:max-w-md h-full">
							<CardHeader className="p-5 pb-1">
								<div className="flex items-center justify-between">
									<span className="font-semibold">Stock records</span>
									<span>{`Total: ${data.total_quantity}`}</span>
								</div>{' '}
							</CardHeader>
							<CardContent className="pb-1">
								<div className="grid gap-3">
									<ul className="grid gap-1">
										<li className="flex items-center justify-between">
											<span className="text-muted-foreground">
												Sale Quantity
											</span>
											<span>{data.sale_quantity}</span>
										</li>
										<li className="flex items-center justify-between">
											<span className="text-muted-foreground">
												Sold Quantity
											</span>
											<span>{data.sold_quantity}</span>
										</li>
										<li className="flex items-center justify-between">
											<span className="text-muted-foreground">
												Ordered Quantity
											</span>
											<span>
												{activeOrder.reduce(
													(sum, pOrder) => sum + (pOrder.total_quantity || 0),
													0,
												)}
											</span>
										</li>
										<li className="flex items-center justify-between">
											<span className="text-muted-foreground">
												Service Quantity
											</span>
											<span>{data.service_quantity}</span>
										</li>
										<li className="flex items-center justify-between">
											<span className="text-muted-foreground">
												Rent Quantity
											</span>
											<span>{data.rent_quantity}</span>
										</li>
										<li className="flex items-center justify-between">
											<span className="text-muted-foreground">
												Damaged Quantity
											</span>
											<span>{data.damage_quantity}</span>
										</li>
									</ul>
								</div>
							</CardContent>
							<CardFooter className="w-full flex-col items-start pt-0">
								<p className=" text-gray-500 text-xs font-semibold">
									Has currently {currentOrder.length} active/draft purchase
									order
								</p>
								<CreatePODialogue
									id={data.product_id!}
									serialize={data.is_serialize!}
								/>
							</CardFooter>
						</Card>
					</div>
				</div>
			</div>
			<ViewRecordTabs
				product_id={id}
				searchParams={searchParams}
				is_serialize={data.is_serialize ?? false}
			/>
		</div>
	);
}
