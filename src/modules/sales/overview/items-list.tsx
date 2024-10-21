import {PaginationResponse, request} from '@/api/axios';
import {useSalesHook} from '@/components/hooks/use-sales-hook';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {ScrollArea} from '@/components/ui/scroll-area';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {ItemWithDetails} from '@/lib/inventory-zod-schema';
import {DoubleArrowLeftIcon, DoubleArrowRightIcon} from '@radix-ui/react-icons';
import {ChevronLeftIcon, ChevronRightIcon} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {toast} from 'sonner';

export function ItemsList() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const [items, setItems] = useState<ItemWithDetails[]>([]);
	const [pageCount, setPageCount] = useState<number>(0);
	const [pageLimit, setPageLimit] = useState<number>(
		Number(searchParams.get('limit')) || 10,
	);
	const [quantities, setQuantities] = useState<{[key: number]: number}>({}); // State to track quantities for each item

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

	const handleQuantityChange = (
		itemId: number,
		value: string,
		availableQuantity: number,
	) => {
		const newValue = Math.min(Number(value), availableQuantity); // Cap the value
		setQuantities((prev) => ({
			...prev,
			[itemId]: newValue < 0 ? 0 : newValue, // Ensure value is non-negative
		}));
	};

	// Handling interactivity
	const {salesHookData, setSaleHookData} = useSalesHook();

	const handleAddItem = (item: ItemWithDetails) => {
		if (!salesHookData['service']) {
			alert('Create service First!');
		}
		const updateService = {
			...salesHookData['service'][0],
			has_job_order: true,
		};
		setSaleHookData('service', [updateService], 'clear');
		const quantity = quantities[item.item_id] || 0;

		if (quantity <= 0) {
			alert('Please enter a valid quantity.');
			return;
		}

		const existingItems = salesHookData['sales_item'] || [];

		const existingItem = existingItems.find(
			(data) =>
				data.data.item_id === item.item_id && data.data.type === 'Sales',
		);

		if (existingItem) {
			// If the item exists, calculate the new total quantity
			const newQuantity = existingItem.data.quantity + quantity;
			console.log(existingItem);
			// Check if the new item exceeds the available stock
			if (newQuantity > item.stock) {
				alert('Not enough items available.');
				return;
			}

			// Update the existing item with the new quantity and total price
			const updatedData = {
				...existingItem,
				data: {
					...existingItem.data,
					quantity: newQuantity,
					total_price: newQuantity * item.product.price,
				},
			};
			// Replace the existing item in the sales_item array
			const updatedItems = existingItems.map((data) =>
				data.data.item_id === item.item_id ? updatedData : data,
			);

			// Update the state
			setSaleHookData('sales_item', updatedItems, 'clear'); // Use 'clear' to replace the existing items
			toast(`Updated ${item.product.name} qty: ${newQuantity} in the cart`);
		} else {
			// If the item does not exist, check if there's enough stock
			if (quantity > item.stock) {
				// Assume item.quantity is the available stock
				alert('Not enough items available.');
				return;
			}

			// Add the item to the cart
			const data = {
				data: {
					item_id: item.item_id,
					service_id: undefined,
					quantity: quantity,
					type: 'Sales',
					total_price: quantity * item.product.price,
				},
				item,
			};
			setSaleHookData('sales_item', [data], 'append');
			toast(`Added ${item.product.name} qty: ${quantity} to the cart`);
		}
	};

	if (items.length === 0) {
		return (
			<Card className="relative w-full h-[170px] overflow-hidden">
				<CardTitle className="font-semibold text-sm  hover:underline">
					No Item Available
				</CardTitle>
			</Card>
		);
	}
	return (
		<>
			{/* Render your items */}
			<ScrollArea className="h-[calc(90vh-210px)] px-2">
				<div className="flex flex-col gap-3">
					{items.map((item) => (
						<Card
							className="relative w-full h-[170px] overflow-hidden"
							key={item.item_id}
						>
							<div className="flex justify-start">
								<div className="w-[25%] h-full flex-shrink-0 flex items-center justify-center">
									<img
										src={'/img/placeholder.jpg'}
										className="w-full h-full object-center object-cover"
									/>
								</div>
								<CardHeader className="flex flex-col justify-start">
									<CardTitle className="font-semibold text-sm  hover:underline">
										{item.product.name} - {item.product.supplier.name}
									</CardTitle>
									<CardDescription>
										<div className="space-x-1">
											<Badge>{item.product.category.name}</Badge>
											<Badge>{item.tag}</Badge>
										</div>
										<div>
											Qty {item.stock} - Price: {item.product.price}
										</div>
										<div className="w-[90%]">{item.product.description}</div>
									</CardDescription>
								</CardHeader>
							</div>
							<div className="absolute bottom-1 right-3 gap-2 flex items-end justify-end">
								<Button variant={'ghost'}>View Details</Button>
								<div className="flex flex-col gap-3">
									<Input
										className="w-[100px]"
										placeholder="0"
										type="number"
										value={quantities[item.item_id] || ''}
										onChange={
											(e) =>
												handleQuantityChange(
													item.item_id,
													e.target.value,
													item.stock,
												) // Pass the item's quantity
										}
									/>
									<Button
										className="bg-green-400 hover:bg-green-200 w-[100px]"
										onClick={() => handleAddItem(item)}
									>
										Add
									</Button>
								</div>
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
		</>
	);
}
