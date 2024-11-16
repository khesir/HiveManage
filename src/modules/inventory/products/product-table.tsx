import {useCallback, useEffect, useState} from 'react';
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	Row,
	useReactTable,
} from '@tanstack/react-table'; // Adjust the import path based on your project setup
import {useLocation, useNavigate, useSearchParams} from 'react-router-dom';
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
import {Button} from '@/components/ui/button';
import {ChevronLeftIcon, ChevronRightIcon} from 'lucide-react';
import {DoubleArrowLeftIcon, DoubleArrowRightIcon} from '@radix-ui/react-icons';
import {ProductWithRelatedTables} from '@/modules/inventory/_components/validation/product';
import {Input} from '@/components/ui/input';
import useProducts from '../_components/hooks/use-products';
import {Category} from '../_components/validation/category';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Separator} from '@/components/ui/separator';
import {Badge} from '@/components/ui/badge';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	pageSizecategorys?: number[];
	searchKey: string;
	pageCount: number;
	searchParams?: {
		[key: string]: string | string[] | undefined;
	};
	categories: Category[];
}
// type SelectedValue = {
// 	id: number; // Selected ID
// 	name: string; // Selected name
// };
export function ProductWithDetailsTable<
	TData extends ProductWithRelatedTables,
	TValue,
>({
	columns,
	categories,
	data,
	pageCount,
	searchKey,
	pageSizecategorys = [10, 20, 30, 40, 50],
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
				// categories: Array.from(selectedValues).join('.'),
			})}`,
			{replace: true},
		);
	}, [
		pageIndex,
		pageSize,
		// selectedValues,
		navigate,
		location.pathname,
		createQueryString,
	]);

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
	const searchValue = table.getColumn(searchKey)?.getFilterValue() as string;

	// ====================================================================================
	// Search Funtion
	// Debounced search value to avoid triggering requests too frequently
	const [debouncedSearchValue, setDebouncedSearchValue] = useState(searchValue);
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedSearchValue(searchValue);
		}, 500); // Adjust debounce delay as needed
		return () => clearTimeout(handler);
	}, [searchValue]);

	// // Update the URL with the search query when the searchValue changes
	useEffect(() => {
		if (debouncedSearchValue?.length > 0) {
			navigate(
				`${location.pathname}?${createQueryString({
					page: null, // Reset page when searching
					limit: pageSize,
					product_name: debouncedSearchValue, // Add search param to URL
				})}`,
				{replace: true},
			);
		} else {
			navigate(
				`${location.pathname}?${createQueryString({
					page: null,
					limit: pageSize,
					product_name: null, // Remove search param from URL if empty
				})}`,
				{replace: true},
			);
		}

		// Reset pagination to first page on search change
		setPagination((prev) => ({...prev, pageIndex: 0}));
	}, [
		debouncedSearchValue,
		pageSize,
		navigate,
		location.pathname,
		createQueryString,
	]);

	// Set the first employee data to Zustand on initial render
	useEffect(() => {
		if (data.length > 0) {
			const rdata: ProductWithRelatedTables = data[0];
			useProducts.getState().setProduct(rdata);
		}
	}, [data]);

	// This handles the employee viewing by click
	const handleRowClick = (row: Row<TData>) => {
		// Access the data of the clicked row
		const rowData: ProductWithRelatedTables = row.original;

		// Do something with the row data
		useProducts.getState().setProduct(rowData);
	};

	// Filter

	// TODO: Command Dynamic Filter
	// const [selectedValues, setSelectedValues] = useState<Set<SelectedValue>>(
	// 	new Set(),
	// );
	// const handleSelect = (id: number, name: string) => {
	// 	setSelectedValues((prevSet) => {
	// 		const newSet = new Set(prevSet);
	// 		const isSelected = Array.from(newSet).some((item) => item.id === id);

	// 		if (isSelected) {
	// 			// Remove item if it exists
	// 			newSet.forEach((item) => {
	// 				if (item.id === id) newSet.delete(item);
	// 			});
	// 		} else {
	// 			// Add new item
	// 			newSet.add({id, name});
	// 		}

	// 		return newSet;
	// 	});
	// };
	// const selectedValuesArray = Array.from(selectedValues);

	// const resetFilter = () => {
	// 	setSelectedValues(new Set());
	// };
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
		searchParams.get('sort') === 'desc' ? 'desc' : 'asc',
	);
	const handleSortOrderChange = (order: 'asc' | 'desc') => {
		if (sortOrder === order) return;

		setSortOrder(order);
		navigate(
			`${location.pathname}?${createQueryString({
				page: pageIndex + 1,
				limit: pageSize,
				status: categoryFilter,
				sort: order,
			})}`,
			{replace: true},
		);
	};

	// Category Filter
	const [categoryFilter, setCategoryFilter] = useState<number | null>(
		Number(searchParams.get('category_id')),
	);
	const handleCategoryFilterChange = (category_id: number | null) => {
		if (category_id === categoryFilter) return;

		const newCategory = category_id === null ? null : category_id;
		setCategoryFilter(newCategory);

		// Reset to the first page on filter change and update the URL
		navigate(
			`${location.pathname}?${createQueryString({
				page: 1,
				limit: pageSize,
				sort: sortOrder,
				category_id: newCategory,
			})}`,
			{replace: true},
		);

		setPagination((prev) => ({...prev, pageIndex: 0}));
	};
	return (
		<>
			<div className="flex justify-between gap-3 md:gap-0">
				<div className="flex gap-2">
					<Input
						placeholder={`Find product...`}
						value={searchValue ?? ''} // Bind the input value to the current filter value
						onChange={(event) =>
							table.getColumn(searchKey)?.setFilterValue(event.target.value)
						} // Update filter value}
						className="w-full md:max-w-lg"
					/>
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Button variant={'outline'}>
								Sort:{' '}
								<div className="flex items-center">
									<Separator orientation="vertical" className="mx-2 h-4" />
									<Badge
										variant={'secondary'}
										className="rounded-sm px-1 font-normal"
									>
										{sortOrder === 'asc' ? 'Ascending' : 'Descending'}
									</Badge>
								</div>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="flex flex-col">
							<Button
								variant={sortOrder === 'asc' ? 'default' : 'ghost'}
								onClick={() => handleSortOrderChange('asc')}
							>
								Ascending
							</Button>
							<Button
								variant={sortOrder === 'desc' ? 'default' : 'ghost'}
								onClick={() => handleSortOrderChange('desc')}
							>
								Descending
							</Button>
						</DropdownMenuContent>
					</DropdownMenu>
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Button variant={'outline'} className="border-dashed">
								Status
								{categories.find(
									(category) => category.category_id === categoryFilter,
								) ? (
									<div className="flex items-center">
										<Separator orientation="vertical" className="mx-2 h-4" />
										<Badge
											variant={'secondary'}
											className="rounded-sm px-1 font-normal"
										>
											{
												categories.find(
													(category) => category.category_id === categoryFilter,
												)?.name
											}
										</Badge>
									</div>
								) : (
									''
								)}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="flex flex-col">
							<Button
								variant={'ghost'}
								onClick={() => handleCategoryFilterChange(null)}
							>
								Remove filter
							</Button>
							<Separator />
							{categories.map((data, index) => (
								<Button
									key={index}
									variant={
										categoryFilter === data.category_id ? 'default' : 'ghost'
									}
									onClick={() => handleCategoryFilterChange(data.category_id!)}
								>
									{data.name}
								</Button>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				{/* <Popover>
					<PopoverTrigger asChild>
						<Button variant="outline" className="border-dashed">
							<PlusCircledIcon className="mr-2 h-4 w-4" />
							Categories
							{selectedValues.size > 0 && (
								<>
									<Separator orientation="vertical" className="mx-2 h-4" />
									<Badge
										variant="secondary"
										className="rounded-sm px-1 font-normal lg:hidden"
									>
										{selectedValues.size}
									</Badge>
									<div className="hidden space-x-1 lg:flex">
										{selectedValues.size > 2 ? (
											<Badge
												variant="secondary"
												className="rounded-sm px-1 font-normal"
											>
												{selectedValues.size} selected
											</Badge>
										) : (
											selectedValuesArray.map((value) => (
												<Badge
													variant="secondary"
													key={value.id}
													className="rounded-sm px-1 font-normal"
												>
													{value.name}
												</Badge>
											))
										)}
									</div>
								</>
							)}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-[200px] p-0" align="start">
						<Command>
							<CommandInput placeholder={title} />
							<CommandList>
								<CommandEmpty>No results found.</CommandEmpty>
								<CommandGroup>
									{categories.map((category) => (
										<CommandItem
											key={category.category_id}
											onSelect={() =>
												handleSelect(category.category_id!, category.name)
											}
										>
											<div
												className={cn(
													'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
													selectedValuesArray.some(
														(value) => value.id === category.category_id,
													)
														? 'bg-primary text-primary-foreground'
														: 'opacity-50 [&_svg]:invisible',
												)}
											>
												<CheckIcon className="h-4 w-4" aria-hidden="true" />
											</div>
											<span>{category.name}</span>
										</CommandItem>
									))}
								</CommandGroup>
								{selectedValues.size > 0 && (
									<>
										<CommandSeparator />
										<CommandGroup>
											<CommandItem
												onSelect={() => setSelectedValues(new Set())}
												className="justify-center text-center"
											>
												Clear filters
											</CommandItem>
										</CommandGroup>
									</>
								)}
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover> */}
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
									onClick={() => handleRowClick(row)}
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
									{pageSizecategorys.map((pageSize) => (
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
