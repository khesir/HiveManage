import {useEffect, useState} from 'react';
import {ColumnDef, Row} from '@tanstack/react-table';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import {AvatarCircles} from '@/components/ui/avatarcircles';
import {OrderProduct} from '@/components/validation/order-product';

import {DeleteOrderProductConfirmation} from './features/delete-order-product-confirmation';
import {UpdateOrderProductDialogue} from './features/update-order-product';
import {LogSheet} from './actions/log-sheet';
import {PaginationResponse, request} from '@/api/axios';
import {useParams, useSearchParams} from 'react-router-dom';
import useEventTrigger from '@/modules/inventory/_components/hooks/use-event-trigger';
import {OrderProductTable} from './order-product-table';

const ActionCell = (data: OrderProduct) => {
	return (
		<div className="flex gap-2">
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<UpdateOrderProductDialogue orderProduct={data} />
					</TooltipTrigger>
					<TooltipContent>
						<p>Update</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<DeleteOrderProductConfirmation
							product_order_id={data.order_product_id!}
						/>
					</TooltipTrigger>
					<TooltipContent>
						<p>Delete</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};
const UpdateActionCell = (data: OrderProduct) => {
	return (
		<div className="flex gap-2">
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<LogSheet orderProduct={data} />
					</TooltipTrigger>
					<TooltipContent>
						<p>Update</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};
const columns: ColumnDef<OrderProduct>[] = [
	{
		header: 'Product',
		cell: ({row}) => {
			return (
				<div className="flex gap-3 items-center">
					<AvatarCircles
						avatar={[
							{
								link:
									typeof row.original?.product?.img_url === 'string'
										? row.original.product?.img_url
										: '',
								name: row.original.product?.name ?? '',
							},
						]}
					/>
					<span>{`${row.original.product?.name}`}</span>
				</div>
			);
		},
	},
	{
		header: 'Total Value',
		cell: ({row}) => {
			const totalValue =
				Number(row.original.total_quantity) * Number(row.original.unit_price);
			return <span>{totalValue.toFixed(2)}</span>;
		},
	},
	{
		accessorKey: 'unit_price',
		header: 'Unit Price',
	},
	{
		accessorKey: 'ordered_quantity',
		header: 'Ordered Quantity',
	},
	{
		accessorKey: 'delivered_quantity',
		header: 'Delivered Quantity',
	},
	{
		accessorKey: 'resolved_quantity',
		header: 'Resolved Quantity',
	},
	{
		accessorKey: 'status',
		header: 'Status',
	},
	{
		header: 'Action',
		cell: ({row}: {row: Row<OrderProduct>}) => {
			return (
				<>
					{row.original.status === 'Draft' && <ActionCell {...row.original} />}
					{row.original.status !== 'Draft' && (
						<UpdateActionCell {...row.original} />
					)}
					{/* {row.original.status === 'Delivered' && <div>Delivered</div>} */}
				</>
			);
		},
	},
];

export function InformationProductTable() {
	const [searchParams] = useSearchParams();
	const {id} = useParams();
	const [ordersProduct, setOrdersProduct] = useState<OrderProduct[]>([]);
	const [pageCount, setPageCount] = useState<number>(0);
	const page = Number(searchParams.get('page')) || 1;
	const pageLimit = Number(searchParams.get('limit')) || 10;
	const sort = searchParams.get('sort') || null;
	const offset = (page - 1) * pageLimit;
	// Interactivity
	const {isTriggered} = useEventTrigger();

	useEffect(() => {
		const fetchProducts = async () => {
			const res = await request<PaginationResponse<OrderProduct>>(
				'GET',
				`/api/v1/ims/order/${id}/order-product?limit=${pageLimit}&offset=${offset}` +
					(sort ? `&sort=${sort}` : ''),
			);
			setOrdersProduct(res.data);
			setPageCount(Math.ceil(res.total_data / pageLimit));
		};
		fetchProducts();
	}, [offset, pageLimit, isTriggered, sort]);
	return (
		<OrderProductTable
			columns={columns}
			data={ordersProduct}
			pageCount={pageCount}
		/>
	);
}
