import {toast} from 'sonner';
import {useFieldArray, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import axios, {AxiosError} from 'axios';
import {ApiRequest, request} from '@/api/axios';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {Skeleton} from '@/components/ui/skeleton';
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {useState, useEffect} from 'react';
import {Supplier} from '../../../../../components/validation/inventory/supplier';
import {Heading} from '@/components/ui/heading';
import {Button} from '@/components/ui/button';
import {Separator} from '@/components/ui/separator';
import {ScrollArea} from '@/components/ui/scroll-area';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {Input} from '@/components/ui/input';
import {cn} from '@/lib/util/utils';
import {Trash2Icon, AlertTriangleIcon} from 'lucide-react';
import {
	Command,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {AvatarCircles} from '@/components/ui/avatarcircles';
import {Badge} from '@/components/ui/badge';
import {ProductCategory} from '@/components/validation/inventory/category';
import {useNavigate} from 'react-router-dom';
import {Order, orderSchema} from '@/components/validation/inventory/order';
import {Product} from '@/components/validation/inventory/product';
import {ProductSupplier} from '@/components/validation/inventory/product-supplier';
import {Textarea} from '@/components/ui/textarea';

export function CreateOrderForm() {
	const [suppliers, setSuppliers] = useState<Supplier[]>([]);
	const [items, setItems] = useState<ProductSupplier[]>([]);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const [res, setRes] = useState<string | null>(null);
	const [formState, setFormState] = useState<{
		search: {[key: number]: string};
		selectedProduct: {[key: number]: Product};
	}>({
		search: {}, // To store search state for each product (keyed by product index or ID)
		selectedProduct: {}, // To store selected product state for each product
	});
	useEffect(() => {
		setLoading(true);
		const fetchData = async () => {
			try {
				const supplierResult = await request<ApiRequest<Supplier>>(
					'GET',
					`/api/v1/ims/supplier?no_pagination=true`,
				);
				setSuppliers(
					Array.isArray(supplierResult.data)
						? supplierResult.data
						: [supplierResult.data],
				);
			} catch (e) {
				if (e instanceof Error) {
					setRes(e.toString());
				} else if (e instanceof AxiosError) {
					setRes(e.response?.data as string);
				} else {
					setRes('An unknown error occured');
				}
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);
	const form = useForm<Order>({
		resolver: zodResolver(orderSchema),
		defaultValues: {
			supplier_id: '',
			order_status: 'Pending',
			order_value: 0,
		},
		mode: 'onChange',
	});

	const {
		control,
		watch,
		setValue,
		formState: {errors},
	} = form;
	const {fields, append, remove} = useFieldArray({
		control: control,
		name: 'order_products',
	});

	// Watcher to calculate order value
	const orderValueTracker = watch();
	const supplierId = watch('supplier_id');
	const orderItems = watch('order_products');
	// Calculate order value when order items change
	// anything that is serialize will be change to 1 and be disabled
	useEffect(() => {
		const total =
			orderValueTracker.order_products?.reduce(
				(acc, curr) => acc + (curr.quantity * parseInt(curr.unit_price) || 0),
				0,
			) || 0;
		setValue('order_value', total);
	}, [orderValueTracker]);

	// Fetch product variants when supplier ID changes
	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await request<ApiRequest<ProductSupplier>>(
					'GET',
					`/api/v1/ims/productSupplier?no_pagination=true&supplier_id=${supplierId}`,
				);
				setValue('order_products', []);
				setItems(Array.isArray(res.data) ? res.data : [res.data]);
			} catch (error) {
				console.error('Error fetching product variants:', error);
			}
		};
		if (supplierId) fetchData();
	}, [supplierId]);

	const orderStatus = ['Pending', 'On Delivery', 'Returned', 'Cancelled'];

	// Update search state for a specific field dynamically
	const handleSearchChange = (index: number, value: string) => {
		setFormState((prevState) => ({
			...prevState,
			search: {
				...prevState.search,
				[index]: value, // Use the index as a key to update the search state
			},
		}));
	};
	// Update selected product state for a specific field dynamically
	const handleProductSelect = (index: number, product: Product) => {
		const updatedProduct = {
			...product,
			is_serialize: product.is_serialize ?? false,
		};

		setFormState((prevState) => ({
			...prevState,
			selectedProduct: {
				...prevState.selectedProduct,
				[index]: {
					...product,
					is_serialize: product.is_serialize,
				},
			},
		}));
		form.setValue(
			`order_products.${index}.is_serialize`,
			updatedProduct.is_serialize,
		);
	};

	const processForm = async (formData: Order) => {
		try {
			console.log(formData);
			if (formData.order_products?.length == 0) {
				toast.error('No order Items added');
				return;
			}
			await request('POST', `api/v1/ims/order/`, {
				...formData,
				supplier_id: Number(formData.supplier_id),
			});
			toast.success('Order Added');
			navigate(-1);
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

	if (res) {
		return <Card className="flex gap-5"> {res} </Card>;
	}
	if (loading) {
		return <Skeleton className="flex h-[600px]" />;
	}
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(processForm)}
				className="w-full space-y-3"
			>
				<div className="flex items-center">
					<Heading
						title={`Create Order`}
						description="Note: You can add items now or later"
					/>
					<div className="flex gap-3 justify-end ml-auto">
						<Button
							type="button"
							onClick={() =>
								append({
									product_id: -1,
									quantity: 0,
									unit_price: '',
								})
							}
							disabled={fields.length >= items.length}
						>
							{items.length === 0 ? 'No Available Item' : 'Add Items'}
						</Button>
						<Button
							disabled={loading}
							type="submit"
							className="bg-green-400 hover:bg-green-400"
						>
							Create
						</Button>
					</div>
				</div>
				<Separator />
				<div className="flex gap-5">
					<Card className="flex-0 flex flex-col gap-5 p-5 ">
						<p className="text-lg font-semibold">Order Information</p>
						<div className="flex gap-5">
							<div className="flex-1 gap-3 flex flex-col h-full">
								<FormField
									control={form.control}
									name="supplier_id"
									render={({field}) => (
										<Select
											disabled={loading}
											onValueChange={field.onChange}
											value={field.value || ''}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a Supplier" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{suppliers.map((data) => (
													<SelectItem
														key={data.supplier_id?.toString() ?? ''}
														value={data.supplier_id?.toString() ?? ''}
													>
														{data.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								/>

								<FormField
									control={form.control}
									name="expected_arrival"
									render={({field}) => (
										<FormItem>
											<FormLabel>Expected Arrival</FormLabel>
											<FormControl>
												<Input
													type="date"
													disabled={loading}
													placeholder="John"
													{...field}
												/>
											</FormControl>
											<FormDescription>
												This is optional, and can be modify later
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="order_value"
									render={({field}) => (
										<FormItem>
											<FormLabel>Order Value</FormLabel>
											<FormControl>
												<Input disabled={true} placeholder="Value" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="order_status"
									render={({field}) => (
										<FormItem>
											<Select
												disabled={true}
												onValueChange={field.onChange}
												value={field.value || ''}
											>
												<FormLabel>Status</FormLabel>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select a Status" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{orderStatus.map((data, index) => (
														<SelectItem key={index} value={data}>
															{data}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="notes"
									render={({field}) => (
										<FormItem>
											<FormLabel>Note</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Additional information to be noted"
													{...field}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
						</div>
					</Card>
					<ScrollArea className="flex-1 flex flex-col-reverse">
						{fields.map((field, index) => (
							<Card key={field.id} className="p-5 mb-5 mx-2">
								<Accordion type="single" collapsible defaultValue="item-1">
									<AccordionItem value="item-1">
										<AccordionTrigger
											className={cn(
												'relative !no-underline [&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden',
												errors?.order_products?.[index] && 'text-red-700',
											)}
										>
											{`Order Item #${index + 1}`}

											<Button
												variant="outline"
												size="icon"
												className="absolute right-8"
												onClick={() => remove(index)}
											>
												<Trash2Icon className="h-4 w-4 " />
											</Button>
											{errors?.order_products?.[index] && (
												<span className="alert absolute right-8">
													<AlertTriangleIcon className="h-4 w-4   text-red-700" />
												</span>
											)}
										</AccordionTrigger>
										<AccordionContent className="flex gap-5 p-5">
											<div className="flex-1 flex flex-col gap-3">
												<Card>
													<CardHeader className="relative flex flex-row items-center bg-muted/50">
														<div
															className="absolute inset-0 z-0 rounded-lg bg-cover bg-center"
															style={{
																backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8)), url(${
																	formState.selectedProduct[index]?.img_url
																		? formState.selectedProduct[index]?.img_url
																		: '/img/placeholder.jpg'
																})`,
															}}
														></div>
														<div className="relative z-10 flex gap-4">
															<img
																src={
																	typeof formState.selectedProduct[index]
																		?.img_url === 'string'
																		? formState.selectedProduct[index]?.img_url
																		: formState.selectedProduct[index]
																					?.img_url instanceof File
																			? URL.createObjectURL(
																					formState.selectedProduct[index]
																						?.img_url,
																				)
																			: '/img/placeholder.jpg'
																}
																alt={`Product ID ${formState.selectedProduct[index]?.product_id} - ${formState.selectedProduct[index]?.name}`}
																className="rounded-lg w-20 h-20 object-cover"
															/>
															<div className="grid gap-0.5 text-white">
																<CardTitle className="group flex items-center gap-2 text-lg">
																	{`#${formState.selectedProduct[index]?.product_id} ${formState.selectedProduct[index]?.name}`}
																</CardTitle>
																{/* <CardDescription className="text-gray-400">
																	{
																		formState.selectedProduct[index]
																			?.description
																	}
																</CardDescription> */}
															</div>
														</div>
													</CardHeader>
												</Card>
												<FormField
													control={form.control}
													name={`order_products.${index}.quantity`}
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
																		field.onChange(
																			parseInt(e.target.value) || 0,
																		)
																	}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`order_products.${index}.unit_price`}
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
											</div>
											<div className="flex-1">
												<FormField
													control={form.control}
													name={`order_products.${index}.product_id`}
													render={({field}) => (
														<FormItem>
															<FormLabel>Items</FormLabel>
															<Command>
																<CommandInput
																	placeholder="Search for a product..."
																	value={formState.search[index] || ''}
																	onValueChange={(value) => {
																		handleSearchChange(index, value);
																	}}
																/>
																<CommandList className="max-h-[350px]">
																	{items.length > 0 ? (
																		<CommandGroup heading="Products">
																			{items
																				.filter(
																					(item) =>
																						!fields.some(
																							(field) =>
																								field.product_id ===
																								item.product_id,
																						),
																				)
																				.map((item) => (
																					<CommandItem
																						key={item.product_id}
																						onSelect={() => {
																							field.onChange(item.product_id);
																							if (item.product) {
																								handleProductSelect(
																									index,
																									item.product,
																								);
																							}
																							// DO NOT REMOVE THIS
																							// This handles the item-record creation for orders
																							// if removed, system will cause validation error of product_id
																							if (
																								orderItems &&
																								orderItems[index]
																							) {
																								orderItems[index].product_id =
																									Number(item.product_id);
																							}
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
																											name:
																												item.product?.name ??
																												'Unknown',
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
																										{item.product
																											?.product_categories
																											?.length ? (
																											<>
																												{item.product?.product_categories
																													.slice(0, 3)
																													.map(
																														(
																															category: ProductCategory,
																														) => (
																															<Badge
																																key={
																																	category.category_id
																																}
																																variant={
																																	'secondary'
																																}
																																className="rounded-sm px-1 font-normal"
																															>
																																{
																																	category
																																		?.category
																																		?.name
																																}
																															</Badge>
																														),
																													)}
																												{item.product
																													.product_categories
																													.length > 3 && (
																													<Badge
																														variant={
																															'secondary'
																														}
																														className="rounded-sm px-1 font-normal"
																													>
																														+
																														{item.product
																															.product_categories
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
																		<p className="p-3 text-sm text-gray-500">
																			No products found.
																		</p>
																	)}
																</CommandList>
															</Command>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
										</AccordionContent>
									</AccordionItem>
								</Accordion>
							</Card>
						))}
						{fields.length <= 0 && (
							<Card>
								<CardHeader className="flex items-center">
									<p>No Order Items listed</p>
									<CardDescription>
										{items.length === 0
											? 'No Available Item'
											: 'Press Add Item button to add'}
									</CardDescription>
								</CardHeader>
							</Card>
						)}
					</ScrollArea>
				</div>
			</form>
		</Form>
	);
}
