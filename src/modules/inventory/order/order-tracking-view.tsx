import {
	OrderItemWithDetails,
	OrderTrackingItemWithDetails,
} from '../_components/validation/order';
import {useEffect, useState} from 'react';
import {ApiRequest, request} from '@/api/axios';
import {Separator} from '@/components/ui/separator';
import {DataTable} from '@/components/table/data-table';
import {ColumnDef} from '@tanstack/react-table';
import {Badge} from '@/components/ui/badge';
import {Card} from '@/components/ui/card';
import {CreateTrackItem} from './form/create-track-item-form';
import {Button} from '@/components/ui/button';

const columns: ColumnDef<OrderTrackingItemWithDetails>[] = [
	{
		accessorKey: 'quantity',
		header: 'QUANTITY',
	},
	{
		accessorKey: 'tag',
		header: 'TAG',
	},
	{
		accessorKey: 'status',
		header: 'STATUS',
	},
	{
		accessorKey: 'remarks',
		header: 'REMARKS',
	},
];
interface OrderTrackingProps {
	data: OrderItemWithDetails;
}
export function OrderTrackingView({data}: OrderTrackingProps) {
	const [orderTrackingItem, setOrderTrackingItem] = useState<
		OrderTrackingItemWithDetails[]
	>([]);
	const [totalTrackedItems, setTotalTrackedItems] = useState<number>();
	const [totalTotalAcceptedItems, setTotalAcceptedItems] = useState<number>();
	const totalUnmarkItems = data.quantity - (totalTrackedItems ?? 0);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await request<ApiRequest<OrderTrackingItemWithDetails>>(
					'GET',
					`api/v1/ims/order/${data.order_id}/order-items/${data.orderItem_id}/tracking`,
				);
				const arrayData = Array.isArray(res.data) ? res.data : [res.data];
				setOrderTrackingItem(arrayData);
				setTotalTrackedItems(
					arrayData.reduce((total, track) => total + track.quantity, 0),
				);
				setTotalAcceptedItems(
					arrayData.reduce((total, track) => {
						return track.status === 'accepted' ? total + track.quantity : total;
					}, 0),
				);
			} catch (error) {
				console.log(error);
			}
		};
		if (!isModalOpen) {
			fetchData();
		}
	}, [isModalOpen, data]);

	const handleModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	return (
		<div className="m-5 grid grid-cols-3 gap-5">
			<div className="col-span-2">
				<div className="flex gap-5 items-center">
					<h2 className="text-3xl font-bold tracking-tight">
						{data.product.name}
					</h2>
					<div>
						<Badge>{data.status}</Badge>
					</div>
				</div>
				<p className="text-sm text-muted-foreground">
					{data.product.description}
				</p>

				<div className="space-x-2">
					{data.product.product_categories?.map((category, index) => (
						<Badge key={index}>{category.category.name}</Badge>
					))}
				</div>
			</div>
			<Card className="p-3">
				<li className="flex items-center justify-between">
					<span className="text-muted-foreground">Unmarked Items</span>
					<span>{totalUnmarkItems}</span>
				</li>
				<li className="flex items-center justify-between">
					<span className="text-muted-foreground">Pending Items</span>
					<span>{totalTrackedItems}</span>
				</li>
				<li className="flex items-center justify-between">
					<span className="text-muted-foreground">Items Accepted</span>
					<span>{totalTotalAcceptedItems}</span>
				</li>
			</Card>
			<Separator className="col-span-3" />
			<div className="col-span-3 space-y-2">
				<div className="flex justify-end gap-3">
					{totalTotalAcceptedItems === data.quantity &&
						data.status === 'pending' && <Button>Mark Item Complete</Button>}
					<CreateTrackItem
						isModalOpen={isModalOpen}
						closeModal={handleModal}
						data={data}
						itemCount={totalUnmarkItems}
					/>
				</div>
				<DataTable columns={columns} data={orderTrackingItem}>
					Start Tracking order items by clicking add track
				</DataTable>
			</div>
		</div>
	);
}
