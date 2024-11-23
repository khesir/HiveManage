import {Button} from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {toast} from 'sonner';
import axios from 'axios';
import {
	OrderTrackingItemWithDetails,
	OrderTrackItem,
	orderTrackItemSchema,
} from '../../_components/validation/order';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
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
import {Textarea} from '@/components/ui/textarea';
import {Input} from '@/components/ui/input';
import {useEffect, useState} from 'react';
import {request} from '@/api/axios';
import useTrackReferesh from '../../_components/hooks/uset-track-refresh';

interface OrderTrackingProps {
	data: OrderTrackingItemWithDetails;
}

export function EditFormModal({data}: OrderTrackingProps) {
	const [loading, setLoading] = useState(false);
	const {track, setTrack} = useTrackReferesh();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const handleModal = () => {
		setIsModalOpen(!isModalOpen);
	};
	const form = useForm<OrderTrackItem>({
		resolver: zodResolver(orderTrackItemSchema),
		defaultValues: {
			...data,
			quantity: data.quantity.toString(),
			orderItem_id: data.orderItem_id.toString(),
		},
		mode: 'onChange',
	});
	useEffect(() => {
		form.reset();
	}, []);
	const processForm = async (formData: OrderTrackItem) => {
		try {
			setLoading(true);
			if (Number(formData.quantity) > Number(data.quantity)) {
				toast.error('Total quantity exceeds the allowed count.');
				return;
			}
			await request(
				'PUT',
				`api/v1/ims/order/${data.order?.order_id}/order-items/${data.orderItem_id}/tracking/${data.tracking_id}`,
				formData,
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
	const validTags = [
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
		<Dialog open={isModalOpen} onOpenChange={handleModal}>
			<DialogTrigger className="w-full">
				<Button className="w-full" variant={'ghost'}>
					Edit
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Edit Item</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(processForm)}
						className="space-y-3 px-5"
					>
						{/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}
						<div className="px-3 flex flex-col gap-5">
							<FormField
								control={form.control}
								name={`condition`}
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
												{validTags.map((data, key) => (
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
								name={`status`}
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
								name={`quantity`}
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
								name={`remarks`}
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
						</div>
						<DialogFooter>
							<Button onClick={() => handleModal()}>Cancel</Button>
							<Button variant="default" className="bg-green-400" type="submit">
								Confirm
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
