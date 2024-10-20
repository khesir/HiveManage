import {ApiRequest, request} from '@/api/axios';
import {useEmployeeStore} from '@/components/hooks/use-employee-story';
import {useSelectedRowsStore} from '@/components/hooks/use-selelcted-rows';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {ScrollArea, ScrollBar} from '@/components/ui/scroll-area';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {dateParser} from '@/lib/util/utils';
import {Benefits} from '@/lib/employee-zod-schema';
import {DoubleArrowLeftIcon, DoubleArrowRightIcon} from '@radix-ui/react-icons';
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from '@tanstack/react-table';
import {ChevronLeftIcon, ChevronRightIcon} from 'lucide-react';
import {useEffect, useState} from 'react';

// Define the columns for the table
const columns: ColumnDef<Benefits, unknown>[] = [
	{
		id: 'select',
		header: ({table}) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected()}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({row}) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'benefits_id',
		header: 'ID',
	},
	{
		accessorKey: 'name',
		header: 'Benefit Name',
	},
	{
		accessorKey: 'amount',
		header: 'Amount',
	},
	{
		accessorKey: 'benefits_type',
		header: 'Type',
	},
	{
		accessorKey: 'start',
		header: 'Starting Date',
		cell: ({row}) => dateParser(row.original.start),
	},
	{
		accessorKey: 'end',
		header: 'Ending Date',
		cell: ({row}) => dateParser(row.original.end),
	},
];

export function BenefitsList() {
	const {selectedEmployee} = useEmployeeStore();
	const {setSelectedData} = useSelectedRowsStore();
	const [benefits, setBenefits] = useState<Benefits[]>([]);
	const [currentPageData, setCurrentPageData] = useState<Benefits[]>([]);
	const [pageCount, setPageCount] = useState<number>(0);
	const [pageIndex, setPageIndex] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(10);

	useEffect(() => {
		const fetchEmployees = async () => {
			if (selectedEmployee) {
				const res = await request<ApiRequest<Benefits[]>>(
					'GET',
					`/api/v1/ems/employees/${selectedEmployee.employee_id}/benefits`,
				);
				setBenefits(res.data as Benefits[]);

				setPageCount(Math.ceil(res.data.length / pageSize));
			}
		};

		fetchEmployees();
	}, [pageSize]);

	useEffect(() => {
		const offset = pageIndex * pageSize;
		const paginatedData = benefits.slice(offset, offset + pageSize);
		setCurrentPageData(paginatedData);
	}, [benefits, pageIndex, pageSize]);

	const pageSizeOptions = [10, 20, 30, 50, 100];

	const table = useReactTable({
		data: currentPageData, // Use paginated data
		columns,
		pageCount: pageCount,
		state: {
			pagination: {pageIndex, pageSize},
		},
		onPaginationChange: (updater) => {
			const newPagination =
				typeof updater === 'function'
					? updater({pageIndex, pageSize})
					: updater;
			setPageIndex(newPagination.pageIndex);
			setPageSize(newPagination.pageSize);
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	useEffect(() => {
		// This is for form typing error
		const selectedRows = table.getSelectedRowModel().rows;
		const selectedData = selectedRows.map((row) => ({
			...row.original,
			amount: row.original.amount.toString(), // Convert amount to string
		}));

		setSelectedData('benefits', selectedData);
	}, [table.getSelectedRowModel().rows, setSelectedData]);

	return (
		<>
			{/* Search and Add New Button
			<div className="flex justify-between gap-3 md:gap-0">
				<Input
					placeholder={`Find employee...`}
					value={searchValue ?? ''} // Bind the input value to the current filter value
					onChange={(event) => {
						setSearchValue(event.target.value);
						table.getColumn('name')?.setFilterValue(event.target.value); // Adjust filter key if necessary
					}}
					className="w-full md:max-w-sm"
				/>
				<Link
					to={'create'}
					className={cn(buttonVariants({variant: 'default'}))}
				>
					<Plus className="mr-2 h-4 w-4" /> Add New
				</Link>
			</div> */}
			{/* Table */}
			<ScrollArea className="h-[calc(81vh-220px)] rounded-md border">
				<Table className="relative">
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								))}
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

			{/* Pagination Controls */}
			<div className="flex flex-col items-center justify-end gap-2 space-x-2 py-4 sm:flex-row">
				<div className="flex w-full items-center justify-between">
					<div className="flex-1 text-sm text-muted-foreground">
						{table.getFilteredSelectedRowModel().rows.length} of{' '}
						{table.getFilteredRowModel().rows.length} row(s) selected.
					</div>
					<div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
						<div className="flex items-center space-x-2">
							<p className="whitespace-nowrap text-sm font-medium">
								Rows per page
							</p>
							<Select
								value={`${table.getState().pagination.pageSize}`}
								onValueChange={(value) => table.setPageSize(Number(value))}
							>
								<SelectTrigger className="h-8 w-[70px]">
									<SelectValue
										placeholder={table.getState().pagination.pageSize}
									/>
								</SelectTrigger>
								<SelectContent side="top">
									{pageSizeOptions.map((size) => (
										<SelectItem key={size} value={`${size}`}>
											Show {size}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>
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
