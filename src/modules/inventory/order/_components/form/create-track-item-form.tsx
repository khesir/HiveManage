import {Button} from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {ScrollArea} from '@/components/ui/scroll-area';
import {AlertTriangleIcon, Plus, Trash2Icon} from 'lucide-react';
import {useFieldArray, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useEffect, useState} from 'react';
import {toast} from 'sonner';
import {AxiosError} from 'axios';
import {Card} from '@/components/ui/card';
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
import {Textarea} from '@/components/ui/textarea';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import {cn} from '@/lib/util/utils';
import {request} from '@/api/axios';
import {
	OrderTrackItemArray,
	orderTrackItemArraySchema,
} from '@/components/validation/inventory/order-tracking';
import {OrderItem} from '@/components/validation/inventory/order-item';

interface Formprops {
	isModalOpen?: boolean;
	closeModal: () => void;
	itemCount: number;
	data: OrderItem;
}

export function CreateTrackItem({
	isModalOpen,
	closeModal,
	itemCount,
	data,
}: Formprops) {
	return (
		<Dialog open={isModalOpen} onOpenChange={closeModal}>
			{/* Call closeModal to handle the modal state */}
			<DialogTrigger asChild>
				<Button>
					<Plus className="mr-2 h-4 w-4" /> Add Track
				</Button>
			</DialogTrigger>
			<DialogContent className="w-[800px] max-w-none">
				<DialogHeader>
					<DialogTitle>Create Track</DialogTitle>
					<DialogDescription>Available Quantity: {itemCount}</DialogDescription>
				</DialogHeader>
				<CreateTrackItemForm
					closeModal={closeModal}
					itemCount={itemCount}
					data={data}
				/>
			</DialogContent>
		</Dialog>
	);
}

function CreateTrackItemForm({closeModal, itemCount, data}: Formprops) {
	const [loading, setLoading] = useState(false);
	const [totalQuantity, setTotalQuantity] = useState<number>(0);
	const defaultTrackItem = {
		orderItem_id: '',
		condition: '',
		status: '',
		quantity: '',
		remark: '',
	};

	const defaultValues: OrderTrackItemArray = {track_record: [defaultTrackItem]};

	const form = useForm<OrderTrackItemArray>({
		resolver: zodResolver(orderTrackItemArraySchema),
		defaultValues,
		mode: 'onChange',
	});

	const {
		control,
		watch,
		formState: {errors},
	} = form;

	const {fields, append, remove} = useFieldArray({
		control,
		name: 'track_record',
	});

	const trackRecordValues = watch();
	useEffect(() => {
		const total = trackRecordValues.track_record.reduce(
			(acc, curr) => acc + (parseInt(curr.quantity) || 0),
			0,
		);
		setTotalQuantity(total);
	}, [trackRecordValues]);

	const processForm = async (formData: OrderTrackItemArray) => {
		try {
			setLoading(true);
			if (totalQuantity > itemCount) {
				toast.error('Total quantity exceeds the allowed count.');
				return;
			}
			const newData = {
				...formData,
				product_name: 'data.product.name',
				quantity: totalQuantity,
			};
			await request(
				'POST',
				`api/v1/ims/order/${data.order_id}/order-items/1/tracking`,
				newData,
			);
			toast.success('Supplier Added');
			closeModal();
		} catch (error) {
			console.log(error);
			toast.error((error as AxiosError).response?.data as string);
		} finally {
			setLoading(false);
		}
	};
	const validConditions = [
		'New',
		'Old',
		'Damaged',
		'Refurbished',
		'Used',
		'Antique',
		'Repaired',
	];
	const validStatuses = [
		'Pending',
		'Accepted',
		'Returned',
		'Replacement_requested',
		'Disposed',
		'Held',
	];
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(processForm)}
				className="space-y-3 px-5"
			>
				<pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>
				<ScrollArea className="flex flex-col gap-5 h-[calc(90vh-190px)]">
					{fields.map((field, index) => (
						<Card key={field.id} className="p-5 mb-5 mx-2">
							<Accordion type="single" collapsible defaultValue="item-1">
								<AccordionItem value="item-1">
									<AccordionTrigger
										className={cn(
											'relative !no-underline [&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden',
											errors?.track_record?.[index] && 'text-red-700',
										)}
									>
										{`Track Item #${index + 1}`}

										<Button
											variant="outline"
											size="icon"
											className="absolute right-8"
											onClick={() => remove(index)}
										>
											<Trash2Icon className="h-4 w-4 " />
										</Button>
										{errors?.track_record?.[index] && (
											<span className="alert absolute right-8">
												<AlertTriangleIcon className="h-4 w-4   text-red-700" />
											</span>
										)}
									</AccordionTrigger>
									<AccordionContent className="px-3 flex flex-col gap-5">
										<FormField
											control={form.control}
											name={`track_record.${index}.condition`}
											render={({field}) => (
												<FormItem>
													<FormLabel>Tag</FormLabel>
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
																	placeholder="Select a Tags"
																/>
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{validConditions.map((data, key) => (
																<SelectItem key={key} value={data.toString()}>
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
											name={`track_record.${index}.status`}
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
																	placeholder="Select a Status"
																/>
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{validStatuses.map((data, key) => (
																<SelectItem key={key} value={data.toString()}>
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
											name={`track_record.${index}.quantity`}
											render={({field}) => (
												<FormItem>
													<FormLabel>Quantity</FormLabel>
													<FormControl>
														<Input
															disabled={loading}
															placeholder="Quantity"
															type="number"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name={`track_record.${index}.remarks`}
											render={({field}) => (
												<FormItem>
													<FormLabel>Remark</FormLabel>
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
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</Card>
					))}
				</ScrollArea>

				<div className="flex flex-col gap-3">
					<Button
						type="button"
						onClick={() =>
							append({
								condition: '',
								status: '',
								quantity: '',
								remarks: '',
							})
						}
					>
						Add Track
					</Button>
					<Button type="submit">Submit</Button>
				</div>
			</form>
		</Form>
	);
}
