import {useCallback, useEffect, useState} from 'react';
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
} from '@tanstack/react-table'; // Adjust the import path based on your project setup
import {
	Link,
	useLocation,
	useNavigate,
	useSearchParams,
} from 'react-router-dom';
import {ScrollArea, ScrollBar} from '@/components/ui/scroll-area';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {Button, buttonVariants} from '@/components/ui/button';
import {ChevronLeftIcon, ChevronRightIcon, Plus} from 'lucide-react';
import {DoubleArrowLeftIcon, DoubleArrowRightIcon} from '@radix-ui/react-icons';
import {ServiceWithDetails} from '@/lib/sales-zod-schema';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Input} from '@/components/ui/input';
import {cn} from '@/lib/util/utils';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	pageSizeOptions?: number[];
	pageCount: number;
	searchParams?: {
		[key: string]: string | string[] | undefined;
	};
	isDetails?: boolean;
}

export function ServiceTable<TData extends ServiceWithDetails, TValue>({
	columns,
	data,
	pageCount,
	pageSizeOptions = [10, 20, 30, 40, 50],
	isDetails = false,
}: DataTableProps<TData, TValue>) {
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams] = useSearchParams();
	// Search Params
	const page = searchParams.get('page') || '1';
	const pageAsNumber = Number(page);
	const fallbackPage =
		isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;

	const per_page = searchParams.get('limit') || '10';
	const perPageAsNumber = Number(per_page);
	const fallBackPerPage = isNaN(perPageAsNumber) ? 10 : perPageAsNumber;
	const [filter, setFilter] = useState<boolean>(true);

	// Create query string
	const createQueryString = useCallback(
		(params: {[s: string]: unknown} | ArrayLike<unknown>) => {
			const newSearchParams = new URLSearchParams(searchParams.toString());

			Object.entries(params).forEach(([key, value]) => {
				if (value === null) {
					newSearchParams.delete(key);
				} else {
					newSearchParams.set(key, String(value));
				}
			});
			return newSearchParams.toString();
		},
		[searchParams],
	);

	// Handle server-side pagination
	const [{pageIndex, pageSize}, setPagination] = useState({
		pageIndex: fallbackPage - 1,
		pageSize: fallBackPerPage,
	});

	useEffect(() => {
		navigate(
			`${location.pathname}?${createQueryString({
				page: pageIndex + 1,
				limit: pageSize,
			})}`,
			{replace: true},
		);
	}, [pageIndex, pageSize, navigate, location.pathname, createQueryString]);

	// Initialize the table
	const table = useReactTable({
		data,
		columns,
		pageCount: pageCount ?? -1,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			pagination: {pageIndex, pageSize},
		},
		onPaginationChange: setPagination,
		getPaginationRowModel: getPaginationRowModel(),
		manualPagination: true,
		manualFiltering: true,
	});

	// Debounced search value to avoid triggering requests too frequently
	// const [debouncedSearchValue, setDebouncedSearchValue] = useState(searchValue);
	// console.log(debouncedSearchValue);
	// useEffect(() => {
	// 	const handler = setTimeout(() => {
	// 		setDebouncedSearchValue(searchValue);
	// 	}, 500); // Adjust debounce delay as needed
	// 	return () => clearTimeout(handler);
	// }, [searchValue]);

	// // Update the URL with the search query when the searchValue changes
	// useEffect(() => {
	// 	if (debouncedSearchValue?.length > 0) {
	// 		navigate(
	// 			`${location.pathname}?${createQueryString({
	// 				page: null, // Reset page when searching
	// 				limit: pageSize,
	// 				fullname: debouncedSearchValue, // Add search param to URL
	// 			})}`,
	// 			{replace: true},
	// 		);
	// 	} else {
	// 		navigate(
	// 			`${location.pathname}?${createQueryString({
	// 				page: null,
	// 				limit: pageSize,
	// 				fullname: null, // Remove search param from URL if empty
	// 			})}`,
	// 			{replace: true},
	// 		);
	// 	}

	// 	// Reset pagination to first page on search change
	// 	setPagination((prev) => ({...prev, pageIndex: 0}));
	// }, [
	// 	debouncedSearchValue,
	// 	pageSize,
	// 	navigate,
	// 	location.pathname,
	// 	createQueryString,
	// ]);

	return (
		<>
			<div className="flex justify-between gap-3">
				<div className="space-x-2 flex">
					{!isDetails && (
						<Input
							placeholder={`Find Service...`}
							// value={searchValue ?? ''} // Bind the input value to the current filter value
							// onChange={(event) =>
							// 	table.getColumn(searchKey)?.setFilterValue(event.target.value)
							// } // Update filter value}
							className="w-[300px]"
						/>
					)}
					{filter ? (
						<Button variant={'outline'} onClick={() => setFilter(!filter)}>
							Filter
						</Button>
					) : (
						<>
							<Button variant={'outline'} onClick={() => setFilter(!filter)}>
								Filter
							</Button>
							<DropdownMenu>
								<DropdownMenu>
									<DropdownMenuTrigger>
										<Button variant={'outline'}>Sort</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="flex flex-col">
										<Button variant={'ghost'}>Asc</Button>
										<Button variant={'ghost'}>Desc</Button>
									</DropdownMenuContent>
								</DropdownMenu>
								<DropdownMenuTrigger>
									<Button variant={'outline'}>Status</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="flex flex-col">
									<Button variant={'ghost'}>No set</Button>
									<Button variant={'ghost'}>Active</Button>
									<Button variant={'ghost'}>Inactive</Button>
								</DropdownMenuContent>
							</DropdownMenu>
							<DropdownMenu>
								<DropdownMenuTrigger>
									<Button variant={'outline'}>Reservation: True</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="flex flex-col">
									<Button variant={'ghost'}>true</Button>
									<Button variant={'ghost'}>false</Button>
								</DropdownMenuContent>
							</DropdownMenu>
							<DropdownMenu>
								<DropdownMenuTrigger>
									<Button variant={'outline'}>Sales : True</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="flex flex-col">
									<Button variant={'ghost'}>true</Button>
									<Button variant={'ghost'}>false</Button>
								</DropdownMenuContent>
							</DropdownMenu>
							<DropdownMenu>
								<DropdownMenuTrigger>
									<Button variant={'outline'}>Borrow: True</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="flex flex-col">
									<Button variant={'ghost'}>true</Button>
									<Button variant={'ghost'}>false</Button>
								</DropdownMenuContent>
							</DropdownMenu>
							<DropdownMenu>
								<DropdownMenuTrigger>
									<Button variant={'outline'}>Joborder : True</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="flex flex-col">
									<Button variant={'ghost'}>true</Button>
									<Button variant={'ghost'}>false</Button>
								</DropdownMenuContent>
							</DropdownMenu>
						</>
					)}
				</div>
				<div className="flex justify-between gap-3 md:gap-0">
					<Link
						to={'create'}
						className={cn(buttonVariants({variant: 'default'}))}
					>
						<Plus className="mr-2 h-4 w-4" /> Add Services
					</Link>
				</div>
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
								onValueChange={(value) => {
									table.setPageSize(Number(value));
								}}
							>
								<SelectTrigger className="h-8 w-[70px]">
									<SelectValue
										placeholder={table.getState().pagination.pageSize}
									/>
								</SelectTrigger>
								<SelectContent side="top">
									{pageSizeOptions.map((pageSize) => (
										<SelectItem key={pageSize} value={`${pageSize}`}>
											{pageSize}
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
