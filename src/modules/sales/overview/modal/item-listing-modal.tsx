import {Button} from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTrigger,
} from '@/components/ui/dialog';

import {PaginationResponse, request} from '@/api/axios';
import {ItemWithDetails} from '@/lib/inventory-zod-schema';
import {useState, useEffect} from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom';
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
import {useItemWithDetailsStore} from '@/components/hooks/use-selected-item';

interface ItemListingModal {
	title: string;
}

export function ItemLisitingModal({title}: ItemListingModal) {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const {addItemWithDetails} = useItemWithDetailsStore();
	const [items, setItems] = useState<ItemWithDetails[]>([]);
	const [pageCount, setPageCount] = useState<number>(0);
	const [pageLimit, setPageLimit] = useState<number>(
		Number(searchParams.get('limit')) || 10,
	);

	const page = Number(searchParams.get('page')) || 1;
	const offset = (page - 1) * pageLimit;
	const sort = searchParams.get('sort') || null;
	const currentPage = offset / pageLimit + 1;
	const pageSizeOptions = [10, 20, 30, 50, 100];

	useEffect(() => {
		const fetchItems = async () => {
			const res = await request<PaginationResponse<ItemWithDetails>>(
				'GET',
				`/api/v1/ims/item?on_listing=true&limit=${pageLimit}&offset=${offset}` +
					(sort ? `&sort=${sort}` : ''),
			);
			setItems(res.data);
			setPageCount(Math.ceil(res.total_data / pageLimit));
		};
		fetchItems();
	}, [offset, pageLimit]);

	const handlePaginationChange = (newPage: number) => {
		const newParams = new URLSearchParams(searchParams);
		newParams.set('page', String(newPage));
		newParams.set('limit', String(pageLimit));
		navigate({search: newParams.toString()});
	};
	const handlePageLimitChange = (newLimit: number) => {
		setPageLimit(newLimit);
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
					<Input placeholder="Search Something" className="w-full" />
				</div>
				<ScrollArea className="h-[calc(90vh-210px)] px-2">
					<div className="flex flex-col gap-3">
						{items.map((item) => (
							<Card
								className="relative w-full h-[100px] overflow-hidden"
								key={item.item_id}
							>
								<div className="flex justify-start">
									<CardHeader className="flex flex-col justify-start">
										<CardTitle className="font-semibold text-sm  hover:underline">
											{item.product.name} - {item.product.supplier.name}
										</CardTitle>
										<CardDescription>
											<div className="space-x-1">
												<Badge>{item.product.category.name}</Badge>
												<Badge>{item.tag}</Badge>
											</div>
										</CardDescription>
									</CardHeader>
								</div>
								<div className="absolute bottom-1 right-3 gap-2 flex items-center justify-end">
									<Button
										className="bg-green-400 hover:bg-green-200"
										onClick={() => addItemWithDetails(item)}
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
									value={pageLimit.toString()}
									onValueChange={(value: string) =>
										handlePageLimitChange(Number(value))
									}
								>
									<SelectTrigger className="h-8 w-[70px]">
										<SelectValue placeholder={pageLimit.toString()} />
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
						Page {currentPage} of {pageCount}
					</div>
					<div className="flex items-center space-x-2">
						<Button
							aria-label="Go to first page"
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex"
							onClick={() => handlePaginationChange(1)}
							disabled={currentPage === 1}
						>
							<DoubleArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
						</Button>
						<Button
							aria-label="Go to previous page"
							variant="outline"
							className="h-8 w-8 p-0"
							onClick={() => handlePaginationChange(currentPage - 1)}
							disabled={currentPage === 1}
						>
							<ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
						</Button>
						<Button
							aria-label="Go to next page"
							variant="outline"
							className="h-8 w-8 p-0"
							onClick={() => handlePaginationChange(currentPage + 1)}
							disabled={currentPage === pageCount}
						>
							<ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
						</Button>
						<Button
							aria-label="Go to last page"
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex"
							onClick={() => handlePaginationChange(pageCount)}
							disabled={currentPage === pageCount}
						>
							<DoubleArrowRightIcon className="h-4 w-4" aria-hidden="true" />
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
