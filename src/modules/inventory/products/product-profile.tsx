import {useNavigate} from 'react-router-dom';
import useProducts from '../_components/hooks/use-products';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {dateParser} from '@/lib/util/utils';
import {File} from 'lucide-react';
import {Separator} from '@/components/ui/separator';
import {Badge} from '@/components/ui/badge';
import clsx from 'clsx';
import {AvatarCircles} from '@/components/ui/avatarcircles';
import {CreatePODialogue} from './_components/dialogue/create-po-dialogue';
import {useEffect, useState} from 'react';
import {Order} from '@/components/validation/order';
import {PaginationResponse, request} from '@/api/axios';
import {OrderProduct} from '@/components/validation/order-product';
import useEventTrigger from '../_components/hooks/use-event-trigger';

export function ProductProfile() {
	const navigate = useNavigate();
	const {data} = useProducts();
	const [currentOrder, setCurrentOrder] = useState<Order[]>([]);
	const [activeOrder, setActiveOrder] = useState<OrderProduct[]>([]);
	const {isTriggered} = useEventTrigger();
	const fetchData = async () => {
		const [orderData, orderProduct] = await Promise.all([
			request<PaginationResponse<Order>>(
				'GET',
				`/api/v1/ims/order/product?product_id=${data?.product_id}&status=Draft&no_pagination=true`,
			),
			request<PaginationResponse<OrderProduct>>(
				'GET',
				`/api/v1/ims/order-product?product=${data?.product_id}&status=Awaiting Arrival`,
			),
		]);
		if (orderData.data) {
			setCurrentOrder(orderData.data);
		} else {
			setCurrentOrder([]);
		}
		if (orderProduct) {
			setActiveOrder(
				orderProduct.data.filter(
					(p) => p.product_id === Number(data?.product_id),
				),
			);
		} else {
			setActiveOrder([]);
		}
	};
	useEffect(() => {
		if (data) {
			fetchData();
		}
	}, [data, isTriggered]);
	if (!data) {
		return (
			<Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
				<CardHeader className="flex flex-row items-start bg-muted/50">
					Not Found
				</CardHeader>
			</Card>
		);
	}
	const avatar = (data.product_suppliers ?? []).map((row) => ({
		name: row.supplier?.name ?? '',
		link:
			typeof row.supplier?.profile_link === 'string'
				? row.supplier.profile_link
				: '',
	}));
	const totalAvatar = avatar.length;
	const numPeople = totalAvatar > 5 ? totalAvatar - 5 : 0;
	return (
		<Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
			<CardHeader className="relative flex flex-row items-start bg-muted/50">
				<div
					className="absolute inset-0 z-0 rounded-lg bg-cover bg-center"
					style={{
						backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8)), url(${
							data?.img_url ? data?.img_url : '/img/placeholder.jpg'
						})`,
					}}
				></div>
				<div className="relative z-10 grid gap-0.5 bg-black p-1 bg-opacity-75 rounded-md">
					<CardTitle className="group flex items-center gap-2 text-lg text-white ">
						{`# ${data.product_id} ${data.name}`}
					</CardTitle>
					{data && (
						<CardDescription>
							Last Updated: {dateParser(data.last_updated ?? '')}
						</CardDescription>
					)}
				</div>
				<div className="relative ml-auto flex items-center flex-col">
					<Button
						size="sm"
						variant="outline"
						className="h-8 gap-1 rounded-b-none"
						onClick={() => {
							const id = Number(data.product_id);
							navigate(`view/${id}`);
						}}
					>
						<File className="h-3.5 w-3.5" />
						<span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
							View More
						</span>
					</Button>
					<div
						className={clsx(
							'text-white hover:none, text-xs w-full text-center font-semibold rounded-b-sm',
							data.is_serialize ? 'bg-green-500' : 'bg-red-500',
						)}
					>
						{data.is_serialize ? 'Serialized' : 'Non-Serialize'}
					</div>
				</div>
			</CardHeader>
			<CardContent className="p-6 text-sm">
				<div className="grid gap-3">
					<div className="font-semibold flex justify-between">
						<div>Information</div>
						<Badge
							className={clsx(
								'text-white hover:none',
								data.status === 'Available' ? 'bg-green-500' : 'bg-red-500',
							)}
						>
							{data.status}
						</Badge>
					</div>
					<ul className="grid gap-3">
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Selling Price</span>
							<span>{data.selling_price}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Category</span>
							<span className="space-x-1">
								{(data.product_categories ?? []).slice(0, 1).map((category) => (
									<Badge key={category.category?.category_id}>
										{category.category?.name}
									</Badge>
								))}
								{(data.product_categories?.length ?? 0) > 1 && (
									<Badge>+{(data.product_categories?.length ?? 0) - 1}</Badge>
								)}
							</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Suppliers</span>
							{avatar.length === 0 ? (
								<span>No suppliers</span>
							) : (
								<AvatarCircles numPeople={numPeople} avatar={avatar} />
							)}
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Re-order level</span>
							<span>{data.re_order_level}</span>
						</li>
						<CreatePODialogue
							id={data.product_id!}
							serialize={data.is_serialize!}
						/>
						<p className=" text-gray-500 text-xs font-semibold">
							Has currently {currentOrder.length} active/draft purchase order
						</p>
					</ul>
				</div>
				<Separator className="my-4" />
				<div className="grid gap-3">
					<div className="flex items-center justify-between">
						<span className="font-semibold">Stock records</span>
						<span>{`Total: ${data.total_quantity}`}</span>
					</div>

					<ul className="grid gap-3">
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Sale Quantity</span>
							<span>{data.sale_quantity}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Sold Quantity</span>
							<span>{data.sold_quantity}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Ordered Quantity</span>
							<span>
								{activeOrder.reduce(
									(sum, pOrder) => sum + (pOrder.total_quantity || 0),
									0,
								)}
							</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Service Quantity</span>
							<span>{data.service_quantity}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Rent Quantity</span>
							<span>{data.rent_quantity}</span>
						</li>
					</ul>
				</div>
			</CardContent>
		</Card>
	);
}
