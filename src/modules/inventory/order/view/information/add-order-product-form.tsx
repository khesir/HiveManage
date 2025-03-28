import {ApiRequest, request} from '@/api/axios';
import useOrderStore from '@/api/order-state';
import {AvatarCircles} from '@/components/ui/avatarcircles';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {
	Command,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {ProductCategory} from '@/components/validation/inventory/category';
import {
	OrderProduct,
	orderProductSchema,
} from '@/components/validation/inventory/order-product';
import {Product} from '@/components/validation/inventory/product';
import {ProductSupplier} from '@/components/validation/inventory/product-supplier';
import {zodResolver} from '@hookform/resolvers/zod';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';

interface Props {
	onSubmit?: () => void;
}

export function AddOrderProductForm({onSubmit}: Props) {
	const {selectedOrder, loading, addOrderItem, getOrderById} = useOrderStore();
	const [items, setItems] = useState<ProductSupplier[]>([]);
	const [selectedProduct, setSelectedProduct] = useState<Product>();
	const [imgUrl, setImgUrl] = useState<string | null>();
	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await request<ApiRequest<ProductSupplier>>(
					'GET',
					`/api/v1/ims/productSupplier?no_pagination=true&supplier_id=${selectedOrder.supplier_id}`,
				);
				console.log(res.data);
				setItems(Array.isArray(res.data) ? res.data : [res.data]);
			} catch (error) {
				console.error('Error fetching product variants:', error);
			}
		};
		fetchData();
	}, [selectedOrder.supplier_id]);

	const form = useForm<OrderProduct>({
		resolver: zodResolver(orderProductSchema),
		defaultValues: {
			unit_price: '0',
			ordered_quantity: 0,
		},
		mode: 'onChange',
	});

	const processForm = async (data: OrderProduct) => {
		try {
			console.log(data);
			addOrderItem(selectedOrder.order_id!, {
				...data,
				order_id: selectedOrder.order_id,
			});
			toast.success('Product Added');
			if (onSubmit) {
				onSubmit();
			}
			getOrderById(selectedOrder.order_id!);
		} catch (error) {
			console.log(error);
			let errorMessage = 'An unexpected error occurred';
			if (axios.isAxiosError(error)) {
				errorMessage =
					error.response?.data?.message || // Use the `message` field if available
					error.response?.data?.errors?.[0]?.message || // If `errors` array exists, use the first error's message
					'Failed to process request';
			}

			toast.error(errorMessage);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(processForm)}
				className="w-full space-y-3"
			>
				<div className="relative h-20 rounded-lg overflow-hidden border border-gray-200">
					{imgUrl ? (
						<img
							src={imgUrl ?? '/img/placeholder.jpg'}
							alt={selectedProduct?.name ?? 'Selected Product'}
							className="w-full h-full object-cover"
						/>
					) : (
						<div className="flex items-center justify-center w-full h-full bg-gray-100">
							<p className="text-gray-500">No Image</p>
						</div>
					)}
					{selectedProduct?.name && (
						<div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-center p-1">
							{selectedProduct.name}
						</div>
					)}
				</div>
				<FormField
					control={form.control}
					name={`ordered_quantity`}
					render={({field}) => (
						<FormItem>
							<FormLabel>Quantity</FormLabel>
							<FormControl>
								<Input
									type="number"
									disabled={loading}
									placeholder="Select Value"
									value={field.value || ''}
									onChange={(e) =>
										field.onChange(parseInt(e.target.value) || 0)
									}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name={`unit_price`}
					render={({field}) => (
						<FormItem>
							<FormLabel>Unit Price</FormLabel>
							<FormControl>
								<Input
									type="number"
									disabled={loading}
									placeholder="1000"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex flex-col gap-2">
					<h1 className="font-semibold">Products</h1>
					{/* ShadCN Command Component for displaying search results */}
					<Command>
						<CommandInput placeholder="Search for a product..." />
						<CommandList className="max-h-[350px]">
							{items.length > 0 ? (
								<CommandGroup heading="Products">
									{items
										.filter(
											(item) =>
												!(selectedOrder.order_products ?? []).some(
													(field) => field.product_id === item.product_id,
												),
										)
										.map((item) => (
											<CommandItem
												key={item.product_id}
												onSelect={() => {
													form.setValue(
														'is_serialize',
														item.product?.is_serialize,
													);
													form.setValue('product_id', item.product_id);
													setSelectedProduct(item.product);
													setImgUrl(item.product?.img_url);
												}}
											>
												<div className="flex items-center gap-3">
													<div>
														<AvatarCircles
															avatar={[
																{
																	link:
																		item.product?.img_url ||
																		'/img/placeholder.jpg',
																	name: item.product?.name ?? 'Unknown',
																},
															]}
														/>
													</div>
													<div className="flex-1">
														<div className="flex gap-3 items-center">
															<p className="font-semibold">
																{`${item.product?.name} - ${item.product?.name}`}
															</p>
															<div className="space-x-2">
																{item.product?.product_categories?.length ? (
																	<>
																		{item.product?.product_categories
																			.slice(0, 3)
																			.map((category: ProductCategory) => (
																				<Badge
																					key={category.category_id}
																					variant={'secondary'}
																					className="rounded-sm px-1 font-normal"
																				>
																					{category?.category?.name}
																				</Badge>
																			))}
																		{item.product.product_categories.length >
																			3 && (
																			<Badge
																				variant={'secondary'}
																				className="rounded-sm px-1 font-normal"
																			>
																				+
																				{item.product.product_categories
																					.length - 3}
																			</Badge>
																		)}
																	</>
																) : null}
															</div>
														</div>
														{item.product && (
															<p className="text-sm text-gray-500">
																{item.product.description}
															</p>
														)}
													</div>
												</div>
											</CommandItem>
										))}
								</CommandGroup>
							) : (
								<p className="p-3 text-sm text-gray-500">No products found.</p>
							)}
						</CommandList>
					</Command>
				</div>
				<div className="flex justify-end">
					<Button
						disabled={loading}
						type="submit"
						className="bg-green-400 hover:bg-green-400"
					>
						Create
					</Button>
				</div>
			</form>
		</Form>
	);
}
