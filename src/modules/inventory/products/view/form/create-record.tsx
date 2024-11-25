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
import {useParams} from 'react-router-dom';
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

export function CreateInventoryRecord() {
	const [loading, setLoading] = useState(false);
	const [res, setRes] = useState<string | null>(null);
	// const navigate = useNavigate();
	const [suppliers, setSuppliers] = useState<Supplier[]>([]);
	const {id} = useParams();
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
	const {fields, append, remove} = useFieldArray({
		control: control,
		name: 'item',
	});

	const items = watch();

	useEffect(() => {
		const total = items.item?.reduce(
			(acc, curr) => acc + (curr.quantity || 0),
			0,
		);
		setValue('total_stock', total ?? 0);
	}, [items, setValue]);

	const processForm = async (data: ItemRecords) => {
		try {
			await request('POST', `/api/v1/ims/product/${id}/item-record`, data);
			toast.success('Record Added');
			// navigate(-1);
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

	const itemCondition = [
		'New',
		'Old',
		'Damaged',
		'Refurbished',
		'Used',
		'Antique',
		'Repaired',
	];
	const itemType = ['Batch', 'Serialized'];
	const itemStatus = ['On Stock', 'Sold', 'Depleted'];

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
				<pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>

				<div className="flex items-center">
					<Heading
						title={`Create Record`}
						description="Note: Adding stock is optional"
					/>
					<div className="flex gap-3 justify-end ml-auto">
						<Button
							type="button"
							onClick={() =>
								append({
									item_number: '',
									item_type: 'Batch',
									item_condition: 'New',
									item_status: 'On Stock',
									quantity: 0,
									unit_price: 0,
									selling_price: 0,
									warranty_expiry_date: '',
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
									<FormField
										control={form.control}
										name={`total_stock`}
										render={({field}) => (
											<FormItem>
												<FormLabel>Item #</FormLabel>
												<FormControl>
													<Input
														type="string"
														disabled={true}
														placeholder="1000"
														{...field}
													/>
												</FormControl>
												<FormDescription>
													Put either batch # or serial # of the product here
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
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
												errors?.item?.[index] && 'text-red-700',
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
											{errors?.item?.[index] && (
												<span className="alert absolute right-8">
													<AlertTriangleIcon className="h-4 w-4   text-red-700" />
												</span>
											)}
										</AccordionTrigger>
										<AccordionContent className="px-3 grid md:grid-cols-2 gap-5">
											<FormField
												control={form.control}
												name={`item.${index}.item_number`}
												render={({field}) => (
													<FormItem>
														<FormLabel>Item #</FormLabel>
														<FormControl>
															<Input
																type="string"
																disabled={loading}
																placeholder="1000"
																{...field}
															/>
														</FormControl>
														<FormDescription>
															Put either batch # or serial # of the product here
														</FormDescription>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name={`item.${index}.item_type`}
												render={({field}) => (
													<FormItem>
														<FormLabel>Type</FormLabel>
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
																	{itemType.map((data, index) => (
																		<SelectItem key={index} value={data}>
																			{data}
																		</SelectItem>
																	))}
																</SelectContent>
															</Select>
														</FormControl>
														<FormDescription>
															Determine If the Item is a serialize item or a
															batch item
														</FormDescription>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name={`item.${index}.item_condition`}
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
																	{itemCondition.map((data, index) => (
																		<SelectItem key={index} value={data}>
																			{data}
																		</SelectItem>
																	))}
																</SelectContent>
															</Select>
														</FormControl>
														<FormDescription>
															Item&apos;s Condition
														</FormDescription>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name={`item.${index}.item_status`}
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
																	{itemStatus.map((data, index) => (
																		<SelectItem key={index} value={data}>
																			{data}
																		</SelectItem>
																	))}
																</SelectContent>
															</Select>
														</FormControl>
														<FormDescription>
															Item&apos;s Current Status
														</FormDescription>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name={`item.${index}.quantity`}
												render={({field}) => (
													<FormItem>
														<FormLabel>Stock</FormLabel>
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
														<FormDescription>
															This will be set to default 1, If the item is a
															serialized item
														</FormDescription>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name={`item.${index}.unit_price`}
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
																	field.onChange(value ? parseFloat(value) : 0);
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
												name={`item.${index}.selling_price`}
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
																	field.onChange(value ? parseFloat(value) : 0);
																}}
															/>
														</FormControl>
														<FormDescription>
															Starting price of this item or batch
														</FormDescription>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name={`item.${index}.warranty_expiry_date`}
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
														<FormDescription>
															( Optional* ) This is only applicable if item is
															serialized
														</FormDescription>
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
									<p>Currently no Item in stock</p>
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
