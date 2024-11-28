import {zodResolver} from '@hookform/resolvers/zod';
import {useFieldArray, useForm} from 'react-hook-form';

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
import {useNavigate, useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
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
import {Button} from '@/components/ui/button';
import {Skeleton} from '@/components/ui/skeleton';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import {Trash2Icon, AlertTriangleIcon} from 'lucide-react';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Separator} from '@/components/ui/separator';
import {cn} from '@/lib/util/utils';
import {Supplier} from '@/modules/inventory/_components/validation/supplier';
import {Heading} from '@/components/ui/heading';
import {
	ItemRecords,
	itemRecordSchema,
} from '@/modules/inventory/_components/validation/item-record';
import {ProductVariant} from '@/modules/inventory/_components/validation/variants';

export function CreateInventoryRecord() {
	const [loading, setLoading] = useState(false);
	const [res, setRes] = useState<string | null>(null);
	const navigate = useNavigate();
	const [suppliers, setSuppliers] = useState<Supplier[]>([]);
	const [variants, setVariants] = useState<ProductVariant[]>([]);

	const {id} = useParams();
	useEffect(() => {
		setLoading(true);
		const fetchData = async () => {
			try {
				const [supplierResult, productVariantResult] = await Promise.all([
					request<ApiRequest<Supplier>>(
						'GET',
						`/api/v1/ims/supplier?no_pagination=true`,
					),
					request<ApiRequest<ProductVariant>>(
						'GET',
						`/api/v1/ims/product/${id}/variant?no_pagination=true`,
					),
				]);
				setSuppliers(
					Array.isArray(supplierResult.data)
						? supplierResult.data
						: [supplierResult.data],
				);
				setVariants(
					Array.isArray(productVariantResult.data)
						? productVariantResult.data
						: [productVariantResult.data],
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

	const form = useForm<ItemRecords>({
		resolver: zodResolver(itemRecordSchema),
		mode: 'onChange',
	});

	const {
		control,
		watch,
		setValue,
		formState: {errors},
	} = form;

	// For batch items
	const {
		fields: batchFields,
		append: appendBatch,
		remove: removeBatch,
	} = useFieldArray({
		control,
		name: 'item.batch_items',
	});

	// For serialize items
	const {
		fields: serializeFields,
		append: appendSerialized,
		remove: removeSerialized,
	} = useFieldArray({
		control,
		name: 'item.serialize_items',
	});

	// Watch len of serialize items and quantity and add both and set it in item quantity
	const items = watch();

	useEffect(() => {
		const totalBatchQuantity =
			items.item?.batch_items?.reduce(
				(acc, curr) => acc + (curr.quantity || 0),
				0,
			) || 0;

		const totalSerializedQuantity = items.item?.serialize_items?.length || 0;

		setValue('item.quantity', totalBatchQuantity + totalSerializedQuantity);
		setValue('total_stock', totalBatchQuantity + totalSerializedQuantity);
	}, [items, setValue]);

	const processForm = async (data: ItemRecords) => {
		try {
			console.log(data);
			await request('POST', `/api/v1/ims/product/${id}/item-record`, data);
			toast.success('Record Added');
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

	const itemType = ['Batch', 'Serialized', 'Both'];
	const itemStatus = [
		'OnStock',
		'Sold',
		'Depleted',
		'Returned',
		'Pending Payment',
		'On Order',
		'In Transit',
		'Return Requested',
		'Pending Inspection',
		'In Service',
		'Under Repair',
		'Awaiting Service',
		'Ready for Pickup',
		'Retired',
	];
	const subCondition = [
		'New',
		'Old',
		'Damage',
		'Refurbished',
		'Used',
		'Antique',
		'Repaired',
	];
	const batchStatus = ['Active', 'Sold', 'Depleted'];
	const serialStatus = ['Active', 'Sold', 'Decommisioned'];
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
				{/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}

				<div className="flex items-center">
					<Heading
						title={`Create Record`}
						description="New Record means new model, or something, this doesnt do auto stock when same supplier, If same supplier it might be different model, or something different"
					/>
					<div className="flex gap-3 justify-end ml-auto">
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
				<div className="flex gap-5 max-h-[calc(100vh-190px)]">
					<div className="flex-0 flex flex-col gap-5">
						{/* Inventory Record Information */}
						<Card className="flex-0 flex flex-col gap-5 p-5 ">
							<p className="text-lg font-semibold">Inventory Record</p>
							<div className="flex gap-5">
								<div className="flex-1 gap-3 flex flex-col h-full">
									<FormField
										control={form.control}
										name="supplier_id"
										render={({field}) => (
											<FormItem>
												<FormLabel>Supplier</FormLabel>
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
								</div>
							</div>
						</Card>
						{/* Item Information */}
						<Card className="flex-1 flex flex-col gap-5 p-5 ">
							<p className="text-lg font-semibold">Item Data</p>
							<div className="flex gap-5">
								<div className="flex-1 gap-3 flex flex-col h-full">
									<FormField
										control={form.control}
										name="item.item_type"
										render={({field}) => (
											<FormItem>
												<FormLabel>Type</FormLabel>
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
																placeholder="Select a Item Type"
															/>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{itemType.map((data, key) => (
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

									<FormField
										control={form.control}
										name="item.item_status"
										render={({field}) => (
											<FormItem>
												<FormLabel>Status</FormLabel>
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
																placeholder="Select a Item Status"
															/>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{itemStatus.map((data, key) => (
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
									<FormField
										control={form.control}
										name="item.variant_id"
										render={({field}) => (
											<FormItem>
												<FormLabel>Item Variant</FormLabel>
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
																placeholder="Select a Variant"
															/>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{variants.map((data, key) => (
															<SelectItem
																key={key}
																value={data.variant_id?.toString() ?? ''}
															>
																{data.variant_name}
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
										name={`item.reorder_level`}
										render={({field}) => (
											<FormItem>
												<FormLabel>Reorder Level</FormLabel>
												<FormControl>
													<Input
														{...field}
														type="number"
														disabled={loading}
														placeholder="1000"
														onChange={(e) => {
															const value = e.target.value;
															// Ensure the value is converted to a number
															field.onChange(value ? parseFloat(value) : 0);
														}}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name={`item.quantity`}
										render={({field}) => (
											<FormItem>
												<FormLabel>Quantity</FormLabel>
												<FormControl>
													<Input
														{...field}
														type="number"
														disabled={true}
														placeholder="1000"
														onChange={(e) => {
															const value = e.target.value;
															// Ensure the value is converted to a number
															field.onChange(value ? parseFloat(value) : 0);
														}}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
						</Card>
					</div>
					<div className="grid grid-cols-2 gap-5 p-5 flex-1">
						<div>
							<div className="flex justify-between items-center mb-5">
								<p className="text-xl font-semibold">Batch Items</p>
								<Button
									size={'sm'}
									type="button"
									onClick={() =>
										appendBatch({
											batch_number: '',
											item_condition: 'New',
											item_status: 'Active',
											quantity: 0,
											unit_price: 0,
											selling_price: 0,
											production_date: '',
											expiration_date: '',
										})
									}
								>
									Add Item
								</Button>
							</div>
							<ScrollArea className="h-[calc(100vh-190px)]">
								{batchFields.map((field, index) => (
									<Card key={field.id} className="p-5 mb-5 mx-2">
										<Accordion type="single" collapsible defaultValue="item-1">
											<AccordionItem value="item-1">
												<AccordionTrigger
													className={cn(
														'relative !no-underline [&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden',
														errors?.item?.batch_items?.[index] &&
															'text-red-700',
													)}
												>
													{`Batch #${index + 1}`}

													<Button
														variant="outline"
														size="icon"
														className="absolute right-8"
														onClick={() => removeBatch(index)}
													>
														<Trash2Icon className="h-4 w-4 " />
													</Button>
													{errors?.item?.batch_items?.[index] && (
														<span className="alert absolute right-8">
															<AlertTriangleIcon className="h-4 w-4   text-red-700" />
														</span>
													)}
												</AccordionTrigger>
												<AccordionContent className="px-3 grid md:grid-cols-2 gap-5">
													<FormField
														control={form.control}
														name={`item.batch_items.${index}.batch_number`}
														render={({field}) => (
															<FormItem>
																<FormLabel>Batch Number</FormLabel>
																<FormControl>
																	<Input
																		type="string"
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
														name={`item.batch_items.${index}.item_condition`}
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
																			{subCondition.map((data, index) => (
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
														name={`item.batch_items.${index}.item_status`}
														render={({field}) => (
															<FormItem>
																<FormLabel>Status</FormLabel>
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
																			{batchStatus.map((data, index) => (
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
														name={`item.batch_items.${index}.quantity`}
														render={({field}) => (
															<FormItem>
																<FormLabel>Quantity</FormLabel>
																<FormControl>
																	<Input
																		{...field}
																		type="number"
																		disabled={loading}
																		placeholder="1000"
																		onChange={(e) => {
																			const value = e.target.value;
																			// Ensure the value is converted to a number
																			field.onChange(
																				value ? parseFloat(value) : 0,
																			);
																		}}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name={`item.batch_items.${index}.unit_price`}
														render={({field}) => (
															<FormItem>
																<FormLabel>Unit Price</FormLabel>
																<FormControl>
																	<Input
																		{...field}
																		type="number"
																		disabled={loading}
																		placeholder="1000"
																		onChange={(e) => {
																			const value = e.target.value;
																			// Ensure the value is converted to a number
																			field.onChange(
																				value ? parseFloat(value) : 0,
																			);
																		}}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name={`item.batch_items.${index}.selling_price`}
														render={({field}) => (
															<FormItem>
																<FormLabel>Selling Price</FormLabel>
																<FormControl>
																	<Input
																		{...field}
																		type="number"
																		disabled={loading}
																		placeholder="1000"
																		onChange={(e) => {
																			const value = e.target.value;
																			// Ensure the value is converted to a number
																			field.onChange(
																				value ? parseFloat(value) : 0,
																			);
																		}}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name={`item.batch_items.${index}.production_date`}
														render={({field}) => (
															<FormItem>
																<FormLabel>Production Date</FormLabel>
																<FormControl>
																	<Input
																		type="date"
																		disabled={loading}
																		placeholder="Select a date"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name={`item.batch_items.${index}.expiration_date`}
														render={({field}) => (
															<FormItem>
																<FormLabel>Expiry Date</FormLabel>
																<FormControl>
																	<Input
																		type="date"
																		disabled={loading}
																		placeholder="Select a date"
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
								{batchFields.length <= 0 && (
									<Card>
										<CardHeader className="flex items-center">
											<p>Currently no Item</p>
											<CardDescription>
												Press Add Item button to add
											</CardDescription>
										</CardHeader>
									</Card>
								)}
							</ScrollArea>
						</div>
						<div>
							<div className="flex justify-between items-center mb-5">
								<p className="text-xl font-semibold">Serialized Items</p>
								<Button
									size={'sm'}
									type="button"
									onClick={() =>
										appendSerialized({
											serial_number: '',
											item_condition: 'New',
											item_status: 'Active',
											unit_price: 0,
											selling_price: 0,
											warranty_expiry_date: '',
										})
									}
								>
									Add Item
								</Button>
							</div>
							<ScrollArea className="h-[calc(100vh-190px)]">
								{serializeFields.map((field, index) => (
									<Card key={field.id} className="p-5 mb-5 mx-2">
										<Accordion type="single" collapsible defaultValue="item-1">
											<AccordionItem value="item-1">
												<AccordionTrigger
													className={cn(
														'relative !no-underline [&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden',
														errors?.item?.serialize_items?.[index] &&
															'text-red-700',
													)}
												>
													{`Serialized Item #${index + 1}`}

													<Button
														variant="outline"
														size="icon"
														className="absolute right-8"
														onClick={() => removeSerialized(index)}
													>
														<Trash2Icon className="h-4 w-4 " />
													</Button>
													{errors?.item?.serialize_items?.[index] && (
														<span className="alert absolute right-8">
															<AlertTriangleIcon className="h-4 w-4   text-red-700" />
														</span>
													)}
												</AccordionTrigger>
												<AccordionContent className="px-3 grid md:grid-cols-2 gap-5">
													<FormField
														control={form.control}
														name={`item.serialize_items.${index}.serial_number`}
														render={({field}) => (
															<FormItem>
																<FormLabel>Serial Number</FormLabel>
																<FormControl>
																	<Input
																		type="string"
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
														name={`item.serialize_items.${index}.item_condition`}
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
																			{subCondition.map((data, index) => (
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
														name={`item.serialize_items.${index}.item_status`}
														render={({field}) => (
															<FormItem>
																<FormLabel>Status</FormLabel>
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
																					placeholder="Select a Status"
																				/>
																			</SelectTrigger>
																		</FormControl>
																		<SelectContent>
																			{serialStatus.map((data, index) => (
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
														name={`item.serialize_items.${index}.unit_price`}
														render={({field}) => (
															<FormItem>
																<FormLabel>Unit Price</FormLabel>
																<FormControl>
																	<Input
																		{...field}
																		type="number"
																		disabled={loading}
																		placeholder="1000"
																		onChange={(e) => {
																			const value = e.target.value;
																			// Ensure the value is converted to a number
																			field.onChange(
																				value ? parseFloat(value) : 0,
																			);
																		}}
																	/>
																</FormControl>
																<FormDescription>
																	Item&apos;s Individual Price
																</FormDescription>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name={`item.serialize_items.${index}.selling_price`}
														render={({field}) => (
															<FormItem>
																<FormLabel>Selling Price</FormLabel>
																<FormControl>
																	<Input
																		{...field}
																		type="number"
																		disabled={loading}
																		placeholder="1000"
																		onChange={(e) => {
																			const value = e.target.value;
																			// Ensure the value is converted to a number
																			field.onChange(
																				value ? parseFloat(value) : 0,
																			);
																		}}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name={`item.serialize_items.${index}.warranty_expiry_date`}
														render={({field}) => (
															<FormItem>
																<FormLabel>Warranty Expiry Date</FormLabel>
																<FormControl>
																	<Input
																		type="date"
																		disabled={loading}
																		placeholder="Select a date"
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
								{serializeFields.length <= 0 && (
									<Card>
										<CardHeader className="flex items-center">
											<p>Currently no Item</p>
											<CardDescription>
												Press Add Item button to add
											</CardDescription>
										</CardHeader>
									</Card>
								)}
							</ScrollArea>
						</div>
					</div>
				</div>
			</form>
		</Form>
	);
}
