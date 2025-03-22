import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {Product, productSchema} from '../../../../../components/validation/inventory/product';
import {appendFormData} from '@/lib/util/utils';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {toast} from 'sonner';
import axios, {AxiosError} from 'axios';
import {useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {Category} from '../../../../../components/validation/inventory/category';
import {ApiRequest, request} from '@/api/axios';
import {Card} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {Skeleton} from '@/components/ui/skeleton';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {Supplier} from '../../../../../components/validation/inventory/supplier';
import {Heading} from '@/components/ui/heading';
import {Separator} from '@/components/ui/separator';
import {Badge} from '@/components/ui/badge';
import {Checkbox} from '@/components/ui/checkbox';

export function CreateProductForm() {
	const [loading, setLoading] = useState(false);
	const [res, setRes] = useState<string | null>(null);
	const navigate = useNavigate();
	const [categories, setCategories] = useState<Category[]>([]);

	const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
	useEffect(() => {
		setLoading(true);
		const fetchData = async () => {
			try {
				const [categoryResult] = await Promise.all([
					request<ApiRequest<Category>>(
						'GET',
						`/api/v1/ims/category?no_pagination=true`,
					),
					request<ApiRequest<Supplier>>(
						'GET',
						`/api/v1/ims/supplier?no_pagination=true`,
					),
				]);
				// setSuppliers(
				// 	Array.isArray(supplierResult.data)
				// 		? supplierResult.data
				// 		: [supplierResult.data],
				// );
				setCategories(
					Array.isArray(categoryResult.data)
						? categoryResult.data
						: [categoryResult.data],
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

	const defaultProductFormValues: Product = {
		name: '',
		img_url: undefined,
		is_serialize: false,
		status: 'Unavailable',
		product_details: {
			description: '',
			color: '',
			size: '',
		},
	};

	const form = useForm<Product>({
		resolver: zodResolver(productSchema),
		defaultValues: defaultProductFormValues,
		mode: 'onChange',
	});
	// type ItemRecordError = {
	// 	[key: number]: FieldError | undefined;
	// };
	// const {
	// 	control,
	// 	watch,
	// 	setValue,
	// 	formState: {errors},
	// } = form;
	// const {
	// 	fields: itemRecordFields,
	// 	append: appendItemRecord,
	// 	remove: removeItemRecord,
	// } = useFieldArray({
	// 	control: control,
	// 	name: 'item_record',
	// });
	// const itemRecordErrors = errors.item_record as ItemRecordError | undefined;

	// const appendItemToRecord = (recordIndex: number, newItem: Partial<Item>) => {
	// 	const {append} = useFieldArray({
	// 		control,
	// 		name: `item_record.${recordIndex}.item`,
	// 	});
	// 	append(newItem);
	// };
	// const itemRecords = watch('item_record');

	// useEffect(() => {
	// 	itemRecords.forEach((record: ItemRecords, index: number) => {
	// 		const totalStock =
	// 			record.item?.reduce(
	// 				(acc: number, item: Item) => acc + (item.quantity || 0),
	// 				0,
	// 			) || 0;
	// 		// Update the total stock for this specific `item_record`
	// 		setValue(`item_record.${index}.total_stock`, totalStock);
	// 	});
	// }, [itemRecords, setValue]);

	const processForm = async (data: Product) => {
		try {
			const newData = {
				name: data.name.toString(),
				img_url: data.img_url,
				is_serialize: data.is_serialize,
				status: data.status,
				product_categories: selectedCategories,
				product_details: {
					description: data.product_details?.description,
					color: data.product_details?.color,
					size: data.product_details?.size,
				},
			};
			const formData = new FormData();
			appendFormData(newData, formData);
			console.log('FormData contents:', ...formData.entries());
			await request('POST', `/api/v1/ims/product`, formData);
			toast.success('Product Added');
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

	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const handleFileChange = (
		e: React.ChangeEvent<HTMLInputElement> | undefined,
	) => {
		const file = e!.target.files?.[0];
		if (file) {
			const reader = new FileReader();

			reader.onloadend = () => {
				setSelectedImage(reader.result as string);
			};

			reader.readAsDataURL(file);
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
				className="w-full space-y-3 h-full"
			>
				<div className="flex items-center">
					<Heading title={`Create Product`} description="" />
					<div className="flex gap-3 justify-end ml-auto">
						{/* <Button
							type="button"
							onClick={() =>
								appendItemRecord({
									supplier_id: undefined,
									total_stock: undefined,
									item: [],
								})
							}
						>
							Add Stock
						</Button> */}
					</div>
				</div>
				<Separator />
				<div className="flex flex-col md:flex-row gap-5 items-center">
					<div className=" flex flex-col items-center gap-5 md:order-1 md:flex-[1_1_30%] min-w-[250px]">
						<div className="relative">
							<div className="overflow-hidden rounded-full w-[40vh] h-[40vh] border-2">
								<img
									src={
										selectedImage
											? selectedImage
											: `https://api.dicebear.com/7.x/lorelei/svg?seed=JD`
									}
									alt="Selected profile"
									className="object-cover w-full h-full"
								/>
							</div>
							<div className="absolute bottom-0 left-0">
								<DropdownMenu>
									<DropdownMenuTrigger>
										<Button className="w-full min-w-[200px] max-w-full">
											Attach Image
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="space-y-2 p-3">
										<FormField
											control={form.control}
											name="img_url"
											render={({field}) => (
												<FormItem>
													<FormControl>
														<Input
															type="file"
															disabled={loading}
															onChange={(e) => {
																field.onChange(e.target.files?.[0]);
																handleFileChange(e);
															}}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>
					</div>
					<Card className="flex flex-col gap-5 p-5 md:flex-[1_1_70%] min-w-[300px]">
						<p className="text-lg font-semibold">Base Information</p>
						<div className="flex flex-col gap-5">
							<div className="flex-1 gap-3 flex flex-col h-full">
								<FormField
									control={form.control}
									name="name"
									render={({field}) => (
										<FormItem>
											<FormLabel>Product name</FormLabel>
											<FormControl>
												<Input
													disabled={loading}
													placeholder="John"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="product_details.description"
									render={({field}) => (
										<FormItem>
											<FormLabel>Description</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Describe what is this product"
													disabled={loading}
													className="resize-none overflow-y-auto"
													{...field}
													value={field.value ?? ''}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="is_serialize"
									render={({field}) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
											<FormControl>
												<Checkbox
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<div className="space-y-1 leading-none">
												<FormLabel>
													Check if item is a serialized item
												</FormLabel>
												<FormDescription>
													By checking this, all items will be given a uuid as
													serial identification
												</FormDescription>
											</div>
										</FormItem>
									)}
								/>
								<DropdownMenu>
									<DropdownMenuTrigger className="flex flex-col text-sm gap-3 font-semibold">
										<p>Category</p>
										<Button
											variant={'outline'}
											className="border w-full max-w-full max-h-full flex flex-wrap justify-start gap-3"
											style={{whiteSpace: 'normal'}}
										>
											{selectedCategories.length > 0 ? (
												<div className="flex items-start gap-3 flex-wrap">
													{selectedCategories.slice(0, 3).map((category) => (
														<Badge
															key={category.category_id}
															variant={'secondary'}
															className="rounded-sm px-1 font-normal"
														>
															{category.name}
														</Badge>
													))}
													{selectedCategories.length > 3 && (
														<Badge
															variant={'secondary'}
															className="rounded-sm px-1 font-normal"
														>
															+{selectedCategories.length - 3}
														</Badge>
													)}
												</div>
											) : (
												<p className="text-gray-500">No categories selected</p>
											)}
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="flex flex-col">
										<Button
											variant={'ghost'}
											onClick={() => setSelectedCategories([])}
										>
											Remove all filters
										</Button>
										<Separator />
										{categories.map((data, index) => {
											const isSelected = selectedCategories.some(
												(category) => category.category_id === data.category_id,
											);

											return (
												<Button
													key={index}
													variant={isSelected ? 'default' : 'ghost'}
													onClick={() => {
														if (isSelected) {
															setSelectedCategories((prev) =>
																prev.filter(
																	(category) =>
																		category.category_id !== data.category_id,
																),
															);
														} else {
															setSelectedCategories((prev) => [...prev, data]);
														}
													}}
												>
													{data.name}
												</Button>
											);
										})}
									</DropdownMenuContent>
								</DropdownMenu>
								<div className="w-full grid grid-cols-2 gap-5">
									<FormField
										control={form.control}
										name="product_details.color"
										render={({field}) => (
											<FormItem>
												<FormLabel>Color</FormLabel>
												<FormControl>
													<Input
														disabled={loading}
														placeholder="White"
														{...field}
													/>
													{/* <Input
													type="number"
													{...field}
													disabled={loading}
													placeholder="123123"
													onChange={(e) => {
														const value = e.target.value;
														// Ensure the value is converted to a number
														field.onChange(value ? parseFloat(value) : 0);
													}}
												/> */}
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="product_details.size"
										render={({field}) => (
											<FormItem>
												<FormLabel>Size</FormLabel>
												<FormControl>
													<Input
														disabled={loading}
														placeholder="Standard"
														{...field}
													/>
													{/* <Input
													type="number"
													{...field}
													disabled={loading}
													placeholder="123123"
													onChange={(e) => {
														const value = e.target.value;
														// Ensure the value is converted to a number
														field.onChange(value ? parseFloat(value) : 0);
													}}
												/> */}
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
							<Button
								disabled={loading}
								type="submit"
								className="bg-green-400 hover:bg-green-400"
							>
								Submit
							</Button>
						</div>
					</Card>
				</div>
				{/* Add Record --- Disabled */}
				{/* <ScrollArea className="flex-1 flex flex-col">
						{itemRecordFields.map((field, index) => (
							<>
								<div>
									<Button
										type="button"
										onClick={() =>
											appendItemToRecord(index, {
												item_number: '',
												item_type: 'Batch',
												item_condition: 'New',
												item_status: 'On Stock',
												unit_price: 0,
												quantity: 0,
												selling_price: 0,
												warranty_expiry_date: '',
											})
										}
									>
										Add Item
									</Button>
								</div>
								<Card key={field.id} className="p-5 mb-5 mx-2">
									<Accordion type="single" collapsible defaultValue="item-1">
										<AccordionItem value="item-1">
											<AccordionTrigger
												className={cn(
													'relative !no-underline [&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden',
													itemRecordErrors?.[index] && 'text-red-700',
												)}
											>
												{`Record #${index + 1}`}
												<Button
													variant="outline"
													size="icon"
													className="absolute right-8"
													onClick={() => removeItemRecord(index)}
												>
													<Trash2Icon className="h-4 w-4 " />
												</Button>
												{itemRecordErrors?.[index] && (
													<span className="alert absolute right-8">
														<AlertTriangleIcon className="h-4 w-4   text-red-700" />
													</span>
												)}
											</AccordionTrigger>
											<AccordionContent className="px-3 grid md:grid-cols-2 gap-5">
												<FormField
													control={form.control}
													name={`item_record.${index}.supplier_id`}
													render={({field}) => (
														<FormItem>
															<FormLabel>Suppliers (optional)</FormLabel>
															<Select
																disabled={loading}
																onValueChange={(value) =>
																	field.onChange(Number(value))
																}
																value={field.value?.toString()}
																defaultValue={field.value?.toString()}
															>
																<FormControl>
																	<SelectTrigger>
																		<SelectValue
																			defaultValue={field.value}
																			placeholder="Select a Supplier"
																		/>
																	</SelectTrigger>
																</FormControl>
																<SelectContent>
																	{suppliers.map((data, key) => (
																		<SelectItem
																			key={key}
																			value={data.supplier_id?.toString() ?? ''}
																		>
																			{data.name}
																		</SelectItem>
																	))}
																</SelectContent>
															</Select>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`item_record.${index}.condition`}
													render={({field}) => (
														<FormItem>
															<FormLabel>Condition</FormLabel>
															<FormControl>
																<Select
																	disabled={loading}
																	onValueChange={field.onChange}
																	value={field.value}
																	defaultValue={field.value}
																>
																	<FormControl>
																		<SelectTrigger>
																			<SelectValue
																				defaultValue={field.value}
																				placeholder="Select a condition"
																			/>
																		</SelectTrigger>
																	</FormControl>
																	<SelectContent>
																		{itemTags.map((data, index) => (
																			<SelectItem key={index} value={data}>
																				{data}
																			</SelectItem>
																		))}
																	</SelectContent>
																</Select>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`item_record.${index}.stock`}
													render={({field}) => (
														<FormItem>
															<FormLabel>Stock</FormLabel>
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
													name={`item_record.${index}.unit_price`}
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
											</AccordionContent>
										</AccordionItem>
									</Accordion>
								</Card>
								<div className="col-span-2 border">
									<p className="text-sm">Items</p>
									<div></div>

									{field.item?.map((itemField, itemIndex) => (
										<div key={itemField.id}>
											{`Item #${itemIndex + 1}`}
											<FormField
												control={form.control}
												name={`item_record.${index}.item.${itemIndex}.item_number`}
												render={({field}) => (
													<FormItem>
														<FormControl>
															<Input placeholder="Item Name" {...field} />
														</FormControl>
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name={`item_record.${index}.item.${itemIndex}.item_type`}
												render={({field}) => (
													<FormItem>
														<FormControl>
															<Input placeholder="Item Name" {...field} />
														</FormControl>
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name={`item_record.${index}.item.${itemIndex}.item_condition`}
												render={({field}) => (
													<FormItem>
														<FormControl>
															<Input placeholder="Item Name" {...field} />
														</FormControl>
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name={`item_record.${index}.item.${itemIndex}.item_status`}
												render={({field}) => (
													<FormItem>
														<FormControl>
															<Input placeholder="Item Name" {...field} />
														</FormControl>
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name={`item_record.${index}.item.${itemIndex}.quantity`}
												render={({field}) => (
													<FormItem>
														<FormControl>
															<Input placeholder="Item Name" {...field} />
														</FormControl>
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name={`item_record.${index}.item.${itemIndex}.unit_price`}
												render={({field}) => (
													<FormItem>
														<FormControl>
															<Input placeholder="Item Name" {...field} />
														</FormControl>
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name={`item_record.${index}.item.${itemIndex}.selling_price`}
												render={({field}) => (
													<FormItem>
														<FormControl>
															<Input placeholder="Item Name" {...field} />
														</FormControl>
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name={`item_record.${index}.item.${itemIndex}.warranty_expiry_date`}
												render={({field}) => (
													<FormItem>
														<FormControl>
															<Input placeholder="Item Name" {...field} />
														</FormControl>
													</FormItem>
												)}
											/>
										</div>
									))}
								</div>
							</>
						))}
						{itemRecordFields.length <= 0 && (
							<Card>
								<CardHeader className="flex items-center">
									<p>Currently no stock</p>
									<CardDescription>
										Press Add Stock button to add
									</CardDescription>
								</CardHeader>
							</Card>
						)}
					</ScrollArea> */}
			</form>
			{/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}
		</Form>
	);
}
