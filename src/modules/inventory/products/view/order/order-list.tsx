import {AvatarCircles} from '@/components/ui/avatarcircles';
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
import {OrderProduct} from '@/components/validation/order-product';
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
} from '@tanstack/react-table';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {getAllOrderItems} from '@/api/order-items-api';

const columns: ColumnDef<OrderProduct>[] = [
	{
		header: 'Supplier',
		cell: ({row}) => {
			return (
				<div className="flex gap-3 items-center">
					<AvatarCircles
						avatar={[
							{
								link:
									typeof row.original.order?.supplier?.profile_link === 'string'
										? row.original.order?.supplier?.profile_link
										: '',
								name: row.original.order?.supplier?.name ?? '',
							},
						]}
					/>
					<span>{`${row.original.order?.supplier?.name}`}</span>
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
		header: 'Delivered Qty',
	},
	{
		accessorKey: 'status',
		header: 'Status',
	},
];
export function OrderList() {
	const [loading, setLoading] = useState<boolean>(false);
	const [orderItems, setOrderItems] = useState<OrderProduct[]>([]);
	const {id} = useParams();

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const res = await getAllOrderItems(Number(id));
			setOrderItems(res);
			setLoading(false);
		};
		fetchData();
	}, [id]);
	const [{pageIndex, pageSize}, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const totalPages = Math.ceil(orderItems.length / pageSize);
	// Initialize the table
	const table = useReactTable({
		data: orderItems,
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
