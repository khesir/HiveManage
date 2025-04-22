import {useState} from 'react';
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	Row,
	useReactTable,
} from '@tanstack/react-table'; // Adjust the import path based on your project setup
import {ScrollArea, ScrollBar} from '@/components/ui/scroll-area';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {Button} from '@/components/ui/button';
import {ChevronLeftIcon, ChevronRightIcon} from 'lucide-react';
import {DoubleArrowLeftIcon, DoubleArrowRightIcon} from '@radix-ui/react-icons';
import useOrderStore from '@/api/order-state';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import {AvatarCircles} from '@/components/ui/avatarcircles';
import {OrderProduct} from '@/components/validation/order-product';
import {AddOrderProductDialogue} from './add-order-product-dialogue';
import {DeleteOrderProductConfirmation} from './delete-order-product-confirmation';
import {UpdateOrderProductDialogue} from './update-order-product';
import {FinalizeOrder} from './finalize-order';
import {DeleteOrder} from './delete-order';
import {AddDeliveredProductDialogue} from './add-delivered-product-dialogue';
import {UpdatePaymentDialogue} from './update-payment-dialogue';
import {MarkComplete} from './mark-complete';

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
						<AddDeliveredProductDialogue orderProduct={data} />
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
		accessorKey: 'product.img_url',
		header: 'Img',
		cell: ({row}) => {
			return (
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
			);
		},
	},
	{
		accessorKey: 'product.name',
		header: 'Name',
	},
	{
		header: 'Total Value',
		cell: ({row}) => {
			const totalValue =
				Number(row.original.ordered_quantity) * Number(row.original.unit_price);
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
		header: 'Delivered Qty',
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
					{row.original.status === 'Draft' && (
						<UpdateActionCell {...row.original} />
					)}
					{row.original.status === 'Awaiting Arrival' && (
						<ActionCell {...row.original} />
					)}
					{/* {row.original.status === 'Delivered' && <div>Delivered</div>} */}
				</>
			);
		},
	},
	// ...(status === 'Draft'
	// 	? [

	// 		]
	// 	: status === 'Awaiting Arrival'
	// 		? [

	// 			]
	// 		: []),
];

export function InformationProductTable() {
	const {selectedOrder, loading} = useOrderStore();
	const [{pageIndex, pageSize}, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const totalPages = Math.ceil(
		(selectedOrder?.order_products?.length ?? 0) / pageSize,
	);
	// Initialize the table
	const table = useReactTable({
		data: selectedOrder.order_products || [],
		columns: columns,
		pageCount: totalPages,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			pagination: {pageIndex, pageSize},
		},
		onPaginationChange: setPagination,
		getPaginationRowModel: getPaginationRowModel(),
		manualPagination: true,
	});
	if (loading) {
		return <div>Loading Skelton</div>;
	}
	return (
		<>
			<div className="flex justify-end gap-3 md:gap-0">
				{/* Pending orders -- Controls*/}
				{!loading && selectedOrder.order_status === 'Draft' && (
					<div className="flex gap-3">
						<DeleteOrder />
						<FinalizeOrder />
						<UpdatePaymentDialogue />
						<AddOrderProductDialogue />
					</div>
				)}
				{/* Payment */}
				{!loading && selectedOrder.order_status !== 'Draft' && (
					<div className="flex gap-3">
						<UpdatePaymentDialogue />
						<MarkComplete />
					</div>
				)}
			</div>
			<ScrollArea className="h-[calc(81vh-220px)] rounded-md border">
				<Table className="relative">
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									style={{cursor: 'pointer'}}
									data-state={row.getIsSelected() && 'selected'}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
			<div className="flex flex-col items-center justify-end gap-2 space-x-2 py-4 sm:flex-row">
				<div className="flex w-full items-center justify-between gap-2 sm:justify-end">
					<div className="flex w-[100px] items-center justify-center text-sm font-medium">
						Page {table.getState().pagination.pageIndex + 1} of{' '}
						{table.getPageCount()}
					</div>
					<div className="flex items-center space-x-2">
						<Button
							aria-label="Go to first page"
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex"
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}
						>
							<DoubleArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
						</Button>
						<Button
							aria-label="Go to previous page"
							variant="outline"
							className="h-8 w-8 p-0"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
						</Button>
						<Button
							aria-label="Go to next page"
							variant="outline"
							className="h-8 w-8 p-0"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							<ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
						</Button>
						<Button
							aria-label="Go to last page"
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex"
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}
						>
							<DoubleArrowRightIcon className="h-4 w-4" aria-hidden="true" />
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}
