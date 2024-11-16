import {zodResolver} from '@hookform/resolvers/zod';
import {useFieldArray, useForm} from 'react-hook-form';
import {
	InventoryRecords,
	Product,
	productSchema,
} from '../../_components/validation/product';
import {appendFormData, cn} from '@/lib/util/utils';
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
import {AxiosError} from 'axios';
import {useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {Category} from '../../_components/validation/category';
import {ApiRequest, request} from '@/api/axios';
import {Card, CardDescription, CardHeader} from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Checkbox} from '@/components/ui/checkbox';
import {Button} from '@/components/ui/button';
import {Skeleton} from '@/components/ui/skeleton';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import {Trash2Icon, AlertTriangleIcon} from 'lucide-react';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Supplier} from '../../_components/validation/supplier';
import {Heading} from '@/components/ui/heading';
import {Separator} from '@/components/ui/separator';
import {Badge} from '@/components/ui/badge';

export function CreateProductForm() {
	const [loading, setLoading] = useState(false);
	const [res, setRes] = useState<string | null>(null);
	const navigate = useNavigate();
	const [categories, setCategories] = useState<Category[]>([]);
	const [suppliers, setSuppliers] = useState<Supplier[]>([]);

	const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
	useEffect(() => {
		setLoading(true);
		const fetchData = async () => {
			try {
				const [categoryResult, supplierResult] = await Promise.all([
					request<ApiRequest<Category>>(
						'GET',
						`/api/v1/ims/category?no_pagination=true`,
					),
					request<ApiRequest<Supplier>>(
						'GET',
						`/api/v1/ims/supplier?no_pagination=true`,
					),
				]);
				setSuppliers(
					Array.isArray(supplierResult.data)
						? supplierResult.data
						: [supplierResult.data],
				);
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
	const defaultInventoryRecord: InventoryRecords = {
		supplier_id: undefined,
		product_id: undefined,
		tag: '',
		stock: '',
		unit_price: '',
	};

	const defaultProductFormValues = {
		category_id: undefined,
		supplier_id: undefined,
		name: '',
		description: '',
		on_listing: false,
		price: undefined,
		img_url: undefined,
		inventory_limit: undefined,
		base_price: undefined,
		inventory_record: [defaultInventoryRecord],
	};
	const form = useForm<Product>({
		resolver: zodResolver(productSchema),
		defaultValues: defaultProductFormValues,
		mode: 'onChange',
	});

	const {
		control,
		formState: {errors},
	} = form;
	const {fields, append, remove} = useFieldArray({
		control: control,
		name: 'inventory_record',
	});

	const processForm = async (data: Product) => {
		try {
			const newData = {
				name: data.name,
				description: data.description,
				on_listing: data.on_listing,
				re_order_level: data.re_order_level,
				inventory_limit: data.inventory_limit,
				img_url: data.img_url,
				total_stocks:
					data?.inventory_record?.reduce(
						(acc, data) => acc + Number(data.stock),
						0,
					) ?? 0,
				price_history: data.price_history.price,
				inventory_record: data.inventory_record,
				product_categories: selectedCategories,
			};
			console.log(newData);
			const formData = new FormData();
			appendFormData(newData, formData);
			console.log('FormData contents:', ...formData.entries());
			await request('POST', `/api/v1/ims/product`, formData);
			toast.success('Product Added');
			navigate(-1);
		} catch (error) {
			console.log(error);
			toast.error((error as AxiosError).response?.data as string);
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

	const itemTags = [
		'New',
		'Old',
		'Damaged',
		'Refurbished',
		'Used',
		'Antique',
		'Repaired',
	];
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
						title={`Create Product`}
						description="Note: Adding stock is optional"
					/>
					<div className="flex gap-3 justify-end ml-auto">
						<Button
							type="button"
							onClick={() =>
								append({
									supplier_id: undefined,
									tag: '',
									stock: '',
									unit_price: '',
								})
							}
						>
							Add Stock
						</Button>
						<Button
							disabled={loading}
							type="submit"
							className="bg-green-400 hover:bg-green-400"
						>
							Submit
						</Button>
					</div>
				</div>
				<Separator />
				<div className="flex gap-5 max-h-[calc(90vh-190px)]">
					<ScrollArea>
						<Card className="flex-1 flex flex-col gap-5 p-5 ">
							<p className="text-lg font-semibold">Base Information</p>
							<div className="flex gap-5">
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
										name="description"
										render={({field}) => (
											<FormItem>
												<FormLabel>Description</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Describe what is this product"
														disabled={loading}
														className="resize-none overflow-y-auto"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="on_listing"
										render={({field}) => (
											<FormItem>
												<div className="flex gap-3 items-center">
													<FormControl>
														<Checkbox
															checked={field.value}
															onCheckedChange={field.onChange}
															disabled={loading}
														/>
													</FormControl>
													<p className="font-semibold text-sm">On Listing</p>
												</div>
												<FormDescription>
													Add this Item for selling
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className="w-full">
										<DropdownMenu>
											<DropdownMenuTrigger className="flex flex-col text-sm font-semibold">
												<p>Category</p>
												<Button
													variant={'outline'}
													className="border w-[400px] max-h-full flex flex-wrap justify-start gap-3"
													style={{whiteSpace: 'normal'}}
												>
													{selectedCategories.length > 0 ? (
														<div className="flex items-start gap-3 flex-wrap">
															{selectedCategories
																.slice(0, 4)
																.map((category) => (
																	<Badge
																		key={category.category_id}
																		variant={'secondary'}
																		className="rounded-sm px-1 font-normal"
																	>
																		{category.name}
																	</Badge>
																))}
															{selectedCategories.length > 4 && (
																<Badge
																	variant={'secondary'}
																	className="rounded-sm px-1 font-normal"
																>
																	+{selectedCategories.length - 4}
																</Badge>
															)}
														</div>
													) : (
														<p className="text-gray-500">
															No categories selected
														</p>
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
														(category) =>
															category.category_id === data.category_id,
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
																				category.category_id !==
																				data.category_id,
																		),
																	);
																} else {
																	setSelectedCategories((prev) => [
																		...prev,
																		data,
																	]);
																}
															}}
														>
															{data.name}
														</Button>
													);
												})}
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</div>
								<div className="flex-0 flex flex-col items-center gap-5">
									<div className="relative">
										<div className="overflow-hidden rounded-full w-[250px] h-[250px] border-2">
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
													<Button className="w-full min-w-[100px] max-w-full">
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
							</div>
							<div className="grid grid-cols-2 gap-5 items-center">
								<FormField
									control={form.control}
									name="price_history.price"
									render={({field}) => (
										<FormItem>
											<FormLabel>Base Price</FormLabel>
											<FormControl>
												<Input
													type="number"
													disabled={loading}
													placeholder="123123"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="inventory_limit"
									render={({field}) => (
										<FormItem>
											<FormLabel>Inventory Limit</FormLabel>
											<FormControl>
												<Input
													type="number"
													disabled={loading}
													placeholder="123123"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="re_order_level"
									render={({field}) => (
										<FormItem>
											<FormLabel>Re-Order Level</FormLabel>
											<FormControl>
												<Input
													type="number"
													disabled={loading}
													placeholder="123123"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</Card>
					</ScrollArea>
					<ScrollArea className="flex-1 flex flex-col">
						{fields.map((field, index) => (
							<Card key={field.id} className="p-5 mb-5 mx-2">
								<Accordion type="single" collapsible defaultValue="item-1">
									<AccordionItem value="item-1">
										<AccordionTrigger
											className={cn(
												'relative !no-underline [&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden',
												errors?.inventory_record?.[index] && 'text-red-700',
											)}
										>
											{`Stock #${index + 1}`}

											<Button
												variant="outline"
												size="icon"
												className="absolute right-8"
												onClick={() => remove(index)}
											>
												<Trash2Icon className="h-4 w-4 " />
											</Button>
											{errors?.inventory_record?.[index] && (
												<span className="alert absolute right-8">
													<AlertTriangleIcon className="h-4 w-4   text-red-700" />
												</span>
											)}
										</AccordionTrigger>
										<AccordionContent className="px-3 grid md:grid-cols-2 gap-5">
											<FormField
												control={form.control}
												name={`inventory_record.${index}.supplier_id`}
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
												name={`inventory_record.${index}.tag`}
												render={({field}) => (
													<FormItem>
														<FormLabel>Tags</FormLabel>
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
																			placeholder="Select a Tag"
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
												name={`inventory_record.${index}.stock`}
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
												name={`inventory_record.${index}.unit_price`}
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
					</ScrollArea>
				</div>
			</form>
			{/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}
		</Form>
	);
}
