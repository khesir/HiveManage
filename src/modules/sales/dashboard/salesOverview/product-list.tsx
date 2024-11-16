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
import {ProductWithRelatedTables} from '@/modules/inventory/_components/validation/product';
import {DoubleArrowLeftIcon, DoubleArrowRightIcon} from '@radix-ui/react-icons';
import {ChevronLeftIcon, ChevronRightIcon} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {toast} from 'sonner';

export function ProductsList() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const [Products, setProducts] = useState<ProductWithRelatedTables[]>([]);
	const [pageCount, setPageCount] = useState<number>(0);
	const [pageLimit, setPageLimit] = useState<number>(
		Number(searchParams.get('limit')) || 10,
	);
	const [quantities, setQuantities] = useState<{[key: number]: number}>({}); // State to track quantities for each product

	const page = Number(searchParams.get('page')) || 1;
	const offset = (page - 1) * pageLimit;
	const sort = searchParams.get('sort') || null;
	const currentPage = offset / pageLimit + 1;
	const pageSizeOptions = [10, 20, 30, 50, 100];

	useEffect(() => {
		const fetchProducts = async () => {
			const res = await request<PaginationResponse<ProductWithRelatedTables>>(
				'GET',
				`/api/v1/ims/product?on_listing=true&limit=${pageLimit}&offset=${offset}` +
					(sort ? `&sort=${sort}` : ''),
			);
			setProducts(res.data);
			setPageCount(Math.ceil(res.total_data / pageLimit));
		};
		fetchProducts();
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
		productId: number,
		value: string,
		availableQuantity: number,
	) => {
		const newValue = Math.min(Number(value), availableQuantity); // Cap the value
		setQuantities((prev) => ({
			...prev,
			[productId]: newValue < 0 ? 0 : newValue, // Ensure value is non-negative
		}));
	};

	// Handling interactivity
	const {salesHookData, setSaleHookData} = useSalesHook();

	const handleAddproduct = (product: ProductWithRelatedTables) => {
		if (!salesHookData['service']) {
			alert('Create service First!');
		}
		const updateService = {
			...salesHookData['service'][0],
			has_job_order: true,
		};
		setSaleHookData('service', [updateService], 'clear');
		const quantity = quantities[product.product_id] || 0;

		if (quantity <= 0) {
			alert('Please enter a valid quantity.');
			return;
		}

		const existingProducts = salesHookData['sales_product'] || [];

		const existingproduct = existingProducts.find(
			(data) =>
				data.data.product_id === product.product_id &&
				data.data.type === 'Sales',
		);

		if (existingproduct) {
			// If the product exists, calculate the new total quantity
			const newQuantity = existingproduct.data.quantity + quantity;
			console.log(existingproduct);
			// Check if the new product exceeds the available stock
			if (newQuantity > product.total_stocks) {
				alert('Not enough Products available.');
				return;
			}

			// Update the existing product with the new quantity and total price
			const updatedData = {
				...existingproduct,
				data: {
					...existingproduct.data,
					quantity: newQuantity,
					total_price: newQuantity * 0,
				},
			};
			// Replace the existing product in the sales_product array
			const updatedProducts = existingProducts.map((data) =>
				data.data.product_id === product.product_id ? updatedData : data,
			);

			// Update the state
			setSaleHookData('sales_product', updatedProducts, 'clear'); // Use 'clear' to replace the existing Products
			toast(`Updated ${product.name} qty: ${newQuantity} in the cart`);
		} else {
			// If the product does not exist, check if there's enough stock
			if (quantity > product.total_stocks) {
				// Assume product.quantity is the available stock
				alert('Not enough Products available.');
				return;
			}

			// Add the product to the cart
			const data = {
				data: {
					product_id: product.product_id,
					service_id: undefined,
					quantity: quantity,
					type: 'Sales',
					total_price: quantity * 0,
				},
				product,
			};
			setSaleHookData('sales_product', [data], 'append');
			toast(`Added ${product.name} qty: ${quantity} to the cart`);
		}
	};

	if (Products.length === 0) {
		return (
			<Card className="relative w-full h-[170px] overflow-hidden">
				<CardTitle className="h-full font-semibold text-xl  hover:underline flex Products-center justify-center">
					No product Available
				</CardTitle>
			</Card>
		);
	}
	return (
		<>
			{/* Render your Products */}
			<ScrollArea className="h-[calc(90vh-210px)] px-2">
				<div className="flex flex-col gap-3">
					{Products.map((product) => (
						<Card
							className="relative w-full h-[170px] overflow-hidden"
							key={product.product_id}
						>
							<div className="flex justify-start">
								<div className="w-[25%] h-full flex-shrink-0 flex Products-center justify-center">
									<img
										src={'/img/placeholder.jpg'}
										className="w-full h-full object-center object-cover"
									/>
								</div>
								<CardHeader className="flex flex-col justify-start">
									<CardTitle className="font-semibold text-sm  hover:underline">
										{product.name}
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
										<div>
											Qty {product.total_stocks} - Price:{' '}
											{product.price_history && product.price_history.length > 0
												? product.price_history[0].price
												: 'Not set'}
										</div>
										<div className="w-[60%] text-justify">
											{product.description}
										</div>
									</CardDescription>
								</CardHeader>
							</div>
							<div className="absolute bottom-1 right-3 gap-2 flex Products-end justify-end">
								<Button variant={'ghost'}>View Details</Button>
								<div className="flex flex-col gap-3">
									<Input
										className="w-[100px]"
										placeholder="0"
										type="number"
										value={quantities[product.product_id] || ''}
										onChange={
											(e) =>
												handleQuantityChange(
													product.product_id,
													e.target.value,
													product.total_stocks,
												) // Pass the product's quantity
										}
									/>
									<Button
										className="bg-green-400 hover:bg-green-200 w-[100px]"
										onClick={() => handleAddproduct(product)}
									>
										Add
									</Button>
								</div>
							</div>
						</Card>
					))}
				</div>
			</ScrollArea>
			<div className="flex flex-col Products-center justify-end gap-2 space-x-2 py-4 sm:flex-row">
				<div className="flex w-full Products-center justify-between">
					<div className="flex flex-col Products-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
						<div className="flex Products-center space-x-2">
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
				<div className="flex w-[200px] Products-center justify-center text-sm font-medium">
					Page {currentPage} of {pageCount}
				</div>
				<div className="flex Products-center space-x-2">
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
