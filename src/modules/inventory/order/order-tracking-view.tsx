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
import {CreateTrackItem} from './_components/form/create-track-item-form';
import {Button} from '@/components/ui/button';
import {MoreHorizontal, MoreVertical} from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {MarkItemCompleteFunction} from './_components/modal/mark-item-complete-modal';
import {EditFormModal} from './_components/modal/edit-form-modal';
import {DeleteConfirmModal} from './_components/modal/delete-confirm-modal';
import {StockDeliveredItemModal} from './_components/modal/stock-delivered-item-modal';
import useTrackReferesh from '../_components/hooks/uset-track-refresh';

const columns: ColumnDef<OrderTrackingItemWithDetails>[] = [
	{
		accessorKey: 'quantity',
		header: 'Qty',
	},
	{
		accessorKey: 'condition',
		header: 'Condition',
	},
	{
		accessorKey: 'status',
		header: 'Status',
	},
	{
		accessorKey: 'remarks',
		header: 'Remarks',
		cell: ({row}) => (row.original.remarks ? row.original.remarks : 'N/A'),
	},
	{
		accessorKey: 'isStocked',
		header: 'isStocked',
		cell: ({row}) =>
			row.original.isStocked ? (
				<Badge className="bg-green-600">True</Badge>
			) : (
				<Badge className="bg-red-600">False</Badge>
			),
	},
	{
		id: 'action',
		cell: ({row}) => {
			const data = row.original;
			return (
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Button size={'icon'} className="h-8 w-8" variant={'outline'}>
							<MoreVertical className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<StockDeliveredItemModal data={data} />
						<EditFormModal data={data} />
						<Separator />
						<DeleteConfirmModal data={data} />
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
interface OrderTrackingProps {
	data: OrderItemWithDetails;
}
export function OrderTrackingView({data}: OrderTrackingProps) {
	const [orderTrackingItem, setOrderTrackingItem] = useState<
		OrderTrackingItemWithDetails[]
	>([]);
	const [pendingItems, setPendingItems] = useState<number>(0);
	const [totalTotalAcceptedItems, setTotalAcceptedItems] = useState<number>(0);
	const [totalUnmarkItems, setTotalUnmarkItems] = useState<number>(0);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const {track} = useTrackReferesh();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await request<ApiRequest<OrderTrackingItemWithDetails>>(
					'GET',
					`api/v1/ims/order/${data.order_id}/order-items/${data.orderItem_id}/tracking`,
				);
				console.log(res.data);
				const arrayData = Array.isArray(res.data) ? res.data : [res.data];
				setOrderTrackingItem(arrayData);
				const pendingCount = arrayData.reduce(
					(total, track) => total + Number(track.quantity),
					0,
				);
				const acceptedItems = arrayData.reduce((total, track) => {
					return track.status === 'Accepted'
						? total + Number(track.quantity)
						: total;
				}, 0);
				setTotalUnmarkItems(data.quantity - pendingCount);
				setPendingItems(pendingCount - acceptedItems);
				setTotalAcceptedItems(acceptedItems);
			} catch (error) {
				console.log(error);
			}
		};
		if (!isModalOpen) {
			fetchData();
		}
	}, [isModalOpen, data, track]);

	const handleModal = () => {
		setIsModalOpen(!isModalOpen);
	};
	return (
		<div className="grid grid-cols-3 gap-5">
			<div className="col-span-2">
				<div className="flex gap-3 items-center">
					<h2 className="text-3xl font-bold tracking-tight">
						{data.product.name}
					</h2>
					<div>
						<Badge>{data.status}</Badge>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Button
								size={'icon'}
								className="h-5 w-5 items-center"
								variant={'ghost'}
							>
								<MoreHorizontal className="h-5 w-5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<Button>Delete</Button>
						</DropdownMenuContent>
					</DropdownMenu>
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
					<span>{pendingItems}</span>
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
						data.status === 'Pending' && (
							<MarkItemCompleteFunction data={data} />
						)}
					{totalUnmarkItems > 0 && (
						<CreateTrackItem
							isModalOpen={isModalOpen}
							data={data}
							closeModal={handleModal}
							itemCount={totalUnmarkItems ?? 0}
						/>
					)}
				</div>
				<DataTable columns={columns} data={orderTrackingItem}>
					Start Tracking order items by clicking add track
				</DataTable>
			</div>
		</div>
	);
}
