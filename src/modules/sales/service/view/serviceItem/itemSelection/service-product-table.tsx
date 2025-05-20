import {useMemo, useState} from 'react';
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
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
import {Product} from '@/components/validation/product';
import {Input} from '@/components/ui/input';
import {SelectedServiceItems} from './sheet/selected-product';
import useService from '@/modules/sales/_components/hooks/use-service';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	rowData: TData[];
	onSubmit: () => void;
}
// type SelectedValue = {
// 	id: number; // Selected ID
// 	name: string; // Selected name
// };
export function SalesProductTable<TData extends Product, TValue>({
	columns,
	rowData,
	onSubmit,
}: DataTableProps<TData, TValue>) {
	const [filterValue, setFilterValue] = useState('');
	const {data} = useService();

	const filteredData = useMemo(() => {
		return filterValue
			? rowData.filter((item) =>
					item.name?.toLowerCase().includes(filterValue.toLowerCase()),
				)
			: rowData;
	}, [rowData, filterValue]);

	const table = useReactTable({
		data: filteredData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});
	return (
		<>
			<div className="flex justify-between items-center gap-3 md:gap-0">
				<div className="flex gap-2">
					<div className="flex items-center justify-between">
						<p className="text-sm font-medium">Filter by Name</p>
						<Input
							placeholder="Search serial code..."
							value={filterValue}
							onChange={(e) => setFilterValue(e.target.value)}
							className="max-w-sm"
						/>
					</div>
				</div>
				<SelectedServiceItems
					onSubmit={onSubmit}
					isRent={data?.service_type?.name === 'Rent'}
				/>
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
									// onClick={() => handleRowClick(row)}
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
		</>
	);
}
