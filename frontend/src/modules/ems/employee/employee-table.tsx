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
import {Input} from '@/components/ui/input';
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
import {useEmployeeStore} from '@/modules/ems/_components/hooks/use-employee-story';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {EmployeeRolesWithDetails} from '../_components/validation/employeeRoles';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	searchKey: string;
	pageSizeOptions?: number[];
	pageCount: number;
	searchParams?: {
		[key: string]: string | string[] | undefined;
	};
}

export function EmployeeTable<TData extends EmployeeRolesWithDetails, TValue>({
	columns,
	data,
	searchKey,
	pageCount,
	pageSizeOptions = [10, 20, 30, 40, 50],
}: DataTableProps<TData, TValue>) {
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams] = useSearchParams();
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

	useEffect(() => {
		if (data.length > 0) {
			const firstEmployee = data[0];
			useEmployeeStore.getState().setSelectedEmployee(firstEmployee);
		}
	}, [data]);

	// This handles the employee viewing by click
	const handleRowClick = (row: Row<TData>) => {
		// Access the data of the clicked row
		const rowData: EmployeeRolesWithDetails = row.original;

		// Do something with the row data
		console.log('Clicked row data:', rowData);

		useEmployeeStore.getState().setSelectedEmployee(rowData);
	};
	// ====================================================================================
	// Search Funtion

	const [debouncedSearchValue, setDebouncedSearchValue] = useState(searchValue);
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedSearchValue(searchValue);
		}, 500);
		return () => clearTimeout(handler);
	}, [searchValue]);

	useEffect(() => {
		if (debouncedSearchValue?.length > 0) {
			navigate(
				`${location.pathname}?${createQueryString({
					page: null,
					limit: pageSize,
					fullname: debouncedSearchValue,
				})}`,
				{replace: true},
			);
		} else {
			navigate(
				`${location.pathname}?${createQueryString({
					page: null,
					limit: pageSize,
					uuid: null, // Remove search param from URL if empty
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

	// ====================================================================================
	// Filters
	const [filter, setFilter] = useState<boolean>(true);

	return (
		<>
			<div className="flex justify-between gap-3 md:gap-0">
				<div className="flex gap-3">
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
								<DropdownMenuTrigger>
									<Button variant={'outline'}>Status: Online</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="flex flex-col">
									<Button variant={'ghost'}>No set</Button>
									<Button variant={'ghost'}>Active</Button>
									<Button variant={'ghost'}>Inactive</Button>
								</DropdownMenuContent>
							</DropdownMenu>
						</>
					)}
				</div>
				<Input
					placeholder={`Find employee...`}
					value={searchValue ?? ''} // Bind the input value to the current filter value
					onChange={(event) =>
						table.getColumn(searchKey)?.setFilterValue(event.target.value)
					} // Update filter value}
					className="w-full md:max-w-sm"
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
