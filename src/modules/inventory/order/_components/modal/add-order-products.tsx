import {Button} from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {toast} from 'sonner';
import axios from 'axios';
import {zodResolver} from '@hookform/resolvers/zod';
import {useFieldArray, useForm} from 'react-hook-form';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {Input} from '@/components/ui/input';
import {useEffect, useState} from 'react';
import {ApiRequest, request} from '@/api/axios';
import useTrackReferesh from '../../../_components/hooks/uset-track-refresh';
import {z} from 'zod';
import {ScrollArea} from '@/components/ui/scroll-area';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import {AvatarCircles} from '@/components/ui/avatarcircles';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import {cn} from '@/lib/util/utils';
import {Trash2Icon, AlertTriangleIcon} from 'lucide-react';
import {
	Command,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {Skeleton} from '@/components/ui/skeleton';
import {Badge} from '@/components/ui/badge';
import {Order} from '@/components/validation/inventory/order';
import {Product} from '@/components/validation/inventory/product';
import { OrderItem } from '@/components/validation/inventory/order-product';
interface OrderTrackingProps {
	data: Order;
}

export function AddProductForm({data}: OrderTrackingProps) {
	const [loading, setLoading] = useState(false);
	const {track, setTrack} = useTrackReferesh();
	const [products, setProducts] = useState<Product[]>([]);
	const [addedOrderValue, setAddedOrderValue] = useState<number>();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [formState, setFormState] = useState<{
		search: {[key: number]: string};
		selectedProduct: {[key: number]: Product};
	}>({
		search: {},
		selectedProduct: {},
	});
	useEffect(() => {
		setLoading(true);
		const fetchData = async () => {
			try {
				const productResult = await request<ApiRequest<Product>>(
					'GET',
					`/api/v1/ims/product?no_pagination=true`,
				);
				setProducts(
					Array.isArray(productResult.data)
						? productResult.data
						: [productResult.data],
				);
			} catch (e) {
				console.log(e);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);
	const form = useForm<OrderItem>({
		resolver: zodResolver(orderItemsArraySchema),
		defaultValues: {
			items: [], // Set default values for items
		},
		mode: 'onChange',
	});
	const {
		control,
		watch,
		reset,
		formState: {errors},
	} = form;
	const {fields, append, remove} = useFieldArray({
		control: control,
		name: 'items',
	});
	const handleModal = () => {
		if (!isModalOpen) {
			reset({items: []});
		}
		setIsModalOpen(!isModalOpen);
	};
	// Watcher to calculate order value
	const orderValueTracker = watch();
	useEffect(() => {
		const total =
			orderValueTracker.items?.reduce(
				(acc, curr) =>
					acc + (parseInt(curr.quantity) * parseInt(curr.price) || 0),
				0,
			) || 0;
		setAddedOrderValue(Number(total));
	}, [orderValueTracker]);
	const processForm = async (
		formData: z.infer<typeof orderItemsArraySchema>,
	) => {
		try {
			const newData = {
				order_value: addedOrderValue,
				order_items: formData.items,
			};
			await request(
				'POST',
				`api/v1/ims/order/${data.order_id}/order-items/`,
				newData,
			);
			handleModal();
			toast.success('Tracking Data Updated');
			setTrack(track + 1);
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
		} finally {
			setLoading(false);
		}
	};

	const orderItemStatus = [
		'Pending',
		'Partially Delivered',
		'Delivered',
		'Damaged',
		'Returned',
		'Cancelled',
	];
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
		setFormState((prevState) => ({
			...prevState,
			selectedProduct: {
				...prevState.selectedProduct,
				[index]: product, // Use the index as a key to update the selected product state
			},
		}));
	};
	return (
		<Dialog open={isModalOpen} onOpenChange={handleModal}>
			<DialogTrigger className="w-full">
				<Button className="w-full" variant={'outline'}>
					Add Product
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-none w-[120vh] h-[85vh] flex flex-col">
				<DialogHeader>
					<DialogTitle>Add Purchase Order Product</DialogTitle>
					<DialogDescription>
						Buttons can be located way at the bottom
					</DialogDescription>
				</DialogHeader>
				<ScrollArea className="flex-1">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(processForm)}
							className="space-y-3 px-5 h-full"
						>
							{/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}
							{loading ? (
								<Skeleton className="flex h-[600px]" />
							) : (
								<>
									{fields.map((field, index) => (
										<Card key={field.id} className="p-5 mb-5 mx-2">
											<Accordion
												type="single"
												collapsible
												defaultValue="item-1"
											>
												<AccordionItem value="item-1">
													<AccordionTrigger
														className={cn(
															'relative !no-underline [&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden',
															errors?.items?.[index] && 'text-red-700',
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
														{errors?.items?.[index] && (
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
																				formState.selectedProduct[index]
																					?.img_url
																					? formState.selectedProduct[index]
																							?.img_url
																					: '/img/placeholder.jpg'
																			})`,
																		}}
																	></div>
																	<div className="relative z-10 flex gap-4">
																		<img
																			src={
																				formState.selectedProduct[index]
																					?.img_url
																					? formState.selectedProduct[index]
																							?.img_url
																					: '/img/placeholder.jpg'
																			}
																			alt={`Product ID ${formState.selectedProduct[index]?.product_id} - ${formState.selectedProduct[index]?.name}`}
																			className="rounded-lg w-20 h-20 object-cover"
																		/>
																		<div className="grid gap-0.5 text-white">
																			<CardTitle className="group flex items-center gap-2 text-lg">
																				{`#${formState.selectedProduct[index]?.product_id} ${formState.selectedProduct[index]?.name}`}
																			</CardTitle>
																			<CardDescription className="text-gray-400">
																				{
																					formState.selectedProduct[index]
																						?.description
																				}
																			</CardDescription>
																		</div>
																	</div>
																</CardHeader>
															</Card>
															<FormField
																control={form.control}
																name={`items.${index}.price`}
																render={({field}) => (
																	<FormItem>
																		<FormLabel>Purchase Price</FormLabel>
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
															<FormField
																control={form.control}
																name={`items.${index}.quantity`}
																render={({field}) => (
																	<FormItem>
																		<FormLabel>Quantity</FormLabel>
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
															<FormField
																control={form.control}
																name={`items.${index}.status`}
																render={({field}) => (
																	<FormItem>
																		<FormLabel>Product</FormLabel>
																		<Select
																			disabled={loading}
																			onValueChange={field.onChange}
																			value={field.value ?? ''}
																		>
																			<FormControl>
																				<SelectTrigger>
																					<SelectValue placeholder="Select a Supplier" />
																				</SelectTrigger>
																			</FormControl>
																			<SelectContent>
																				{orderItemStatus.map((data, key) => (
																					<SelectItem key={key} value={data}>
																						{data}
																					</SelectItem>
																				))}
																			</SelectContent>
																		</Select>
																		<FormMessage />
																	</FormItem>
																)}
															/>
														</div>
														<div className="flex-1">
															<FormField
																control={form.control}
																name={`items.${index}.product_id`} // Dynamically access the product ID field for each order item
																render={({field}) => (
																	<FormItem>
																		<FormLabel>Product</FormLabel>
																		<Command>
																			<CommandInput
																				placeholder="Search for a product..."
																				value={formState.search[index] || ''}
																				onValueChange={(value) => {
																					handleSearchChange(index, value);
																				}} // Update the search state
																			/>
																			<CommandList>
																				{products.length > 0 ? (
																					<CommandGroup heading="Products">
																						{products.map((product) => (
																							<CommandItem
																								key={product.product_id}
																								onSelect={() => {
																									field.onChange(
																										product.product_id,
																									);
																									handleProductSelect(
																										index,
																										product,
																									);
																								}}
																							>
																								<div className="flex items-center gap-3">
																									<div>
																										<AvatarCircles
																											avatar={[
																												{
																													link: product.img_url
																														? product.img_url
																														: '#',
																													name: product.name,
																												},
																											]}
																										/>
																									</div>
																									<div className="flex-1">
																										<div className="flex gap-3">
																											<p className="font-semibold">
																												{product.name}
																											</p>
																											<div className="space-x-2">
																												{product
																													?.product_categories
																													?.length ? (
																													<>
																														{product.product_categories
																															.slice(0, 3)
																															.map(
																																(
																																	category: ProductCategoryWithDetails,
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
																																				.category
																																				.name
																																		}
																																	</Badge>
																																),
																															)}
																														{product
																															.product_categories
																															.length > 3 && (
																															<Badge
																																variant={
																																	'secondary'
																																}
																																className="rounded-sm px-1 font-normal"
																															>
																																+
																																{product
																																	.product_categories
																																	.length - 3}
																															</Badge>
																														)}
																													</>
																												) : null}
																											</div>
																										</div>
																										<p className="text-sm text-gray-500">
																											{product.description}
																										</p>
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
												<p>Currently no stock</p>
												<CardDescription>
													Press Add Stock button to add
												</CardDescription>
											</CardHeader>
										</Card>
									)}
								</>
							)}
							<DialogFooter>
								<Button onClick={() => handleModal()}>Cancel</Button>
								<Button
									type="button"
									onClick={() =>
										append({
											product_id: -1,
											quantity: '',
											price: '',
											status: 'Pending',
										})
									}
								>
									Add Stock
								</Button>
								<Button
									variant="default"
									className="bg-green-400"
									type="submit"
								>
									Confirm
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}
