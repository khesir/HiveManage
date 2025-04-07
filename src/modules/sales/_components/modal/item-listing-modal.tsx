import {Button} from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTrigger,
} from '@/components/ui/dialog';

import {PaginationResponse, request} from '@/api/axios';
import {useState, useEffect} from 'react';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import {DoubleArrowLeftIcon, DoubleArrowRightIcon} from '@radix-ui/react-icons';
import {ChevronLeftIcon, ChevronRightIcon} from 'lucide-react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Badge} from '@/components/ui/badge';
import {Input} from '@/components/ui/input';
import {useProductWithRelatedDataStore} from '@/modules/sales/_components/hooks/use-selected-item';
import {ProductWithRelatedTables} from '@/components/validation/product';

interface ItemListingModal {
	title: string;
}

export function ItemLisitingModal({title}: ItemListingModal) {
	const {addProductWithRelatedData} = useProductWithRelatedDataStore();
	const [fullItems, setFullItems] = useState<ProductWithRelatedTables[]>([]);

	const [items, setItems] = useState<ProductWithRelatedTables[]>([]);

	const [pageCount, setPageCount] = useState<number>(0);
	const [pageIndex, setPageIndex] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);

	const pageSizeOptions = [10, 20, 30, 50, 100];
	const [searchValue, setSearchValue] = useState<string>('');
	const [debouncedSearchValue, setDebouncedSearchValue] = useState(searchValue);

	useEffect(() => {
		const fetchItems = async () => {
			const res = await request<PaginationResponse<ProductWithRelatedTables>>(
				'GET',
				`/api/v1/ims/product?on_listing=true&no_pagination=true`,
			);
			setFullItems(res.data);
			setPageCount(Math.ceil(res.total_data / pageSize));
		};
		fetchItems();
	}, [debouncedSearchValue, pageSize]);

	useEffect(() => {
		const offset = pageIndex * pageSize;
		const paginatedData = fullItems.slice(offset, offset + pageSize);
		setItems(paginatedData);
	}, [fullItems, pageIndex, pageSize]);

	const handlePaginationChange = (newPageIndex: number) => {
		setPageIndex(newPageIndex);
	};

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedSearchValue(searchValue);
		}, 500); // Adjust debounce delay as needed
		return () => clearTimeout(handler);
	}, [searchValue]);
	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(event.target.value);
	};
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">Add Item</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader className="font-semibold text-lg">{title}</DialogHeader>
				<DialogDescription className="text-muted-foreground text-md">
					Just Click Add, and it will be added to the items
				</DialogDescription>
				<div className="w-full">
					<Input
						placeholder="Search Product name"
						className="w-full"
						value={searchValue ?? ''}
						onChange={handleSearchChange}
					/>
				</div>
				<ScrollArea className="h-[calc(90vh-210px)] px-2">
					<div className="flex flex-col gap-3">
						{items.map((product) => (
							<Card
								className="relative w-full h-[100px] overflow-hidden"
								key={product.product_id}
							>
								<div className="flex justify-start">
									<CardHeader className="flex flex-col justify-start">
										<CardTitle className="font-semibold text-sm  hover:underline">
											{product.product_id} - {product.name}
										</CardTitle>
										<CardDescription>
											<div className="space-x-1">
												{product.product_categories &&
													product.product_categories.map((category) => (
														<Badge key={category.category_id}>
															{category.category.name}
														</Badge>
													))}
											</div>
										</CardDescription>
									</CardHeader>
								</div>
								<div className="absolute bottom-1 right-3 gap-2 flex items-center justify-end">
									<Button
										className="bg-green-400 hover:bg-green-200"
										onClick={() => addProductWithRelatedData(product)}
									>
										Add
									</Button>
								</div>
							</Card>
						))}
					</div>
				</ScrollArea>
				<div className="flex flex-col items-center justify-end gap-2 space-x-2 py-4 sm:flex-row">
					<div className="flex w-full items-center justify-between">
						<div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
							<div className="flex items-center space-x-2">
								<p className="whitespace-nowrap text-sm font-medium">
									Rows per page
								</p>
								<Select
									value={pageSize.toString()}
									onValueChange={(value: string) => setPageSize(Number(value))}
								>
									<SelectTrigger className="h-8 w-[70px]">
										<SelectValue placeholder={pageSize.toString()} />
									</SelectTrigger>
									<SelectContent side="top">
										{pageSizeOptions.map((size) => (
											<SelectItem key={size} value={`${size}`}>
												{size}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>
					<div className="flex w-[200px] items-center justify-center text-sm font-medium">
						Page {pageIndex + 1} of {pageCount}
					</div>
					<div className="flex items-center space-x-2">
						<Button
							aria-label="Go to first page"
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex"
							onClick={() => handlePaginationChange(0)}
							disabled={pageIndex === 0}
						>
							<DoubleArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
						</Button>
						<Button
							aria-label="Go to previous page"
							variant="outline"
							className="h-8 w-8 p-0"
							onClick={() => handlePaginationChange(pageIndex - 1)}
							disabled={pageIndex === 0}
						>
							<ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
						</Button>
						<Button
							aria-label="Go to next page"
							variant="outline"
							className="h-8 w-8 p-0"
							onClick={() => handlePaginationChange(pageIndex + 1)}
							disabled={pageIndex + 1 >= pageCount}
						>
							<ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
						</Button>
						<Button
							aria-label="Go to last page"
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex"
							onClick={() => handlePaginationChange(pageCount - 1)}
							disabled={pageIndex + 1 >= pageCount}
						>
							<DoubleArrowRightIcon className="h-4 w-4" aria-hidden="true" />
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
