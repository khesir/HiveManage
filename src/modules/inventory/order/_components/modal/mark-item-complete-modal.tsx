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
import {OrderItemWithDetails} from '../../../_components/validation/order';
import {toast} from 'sonner';
import axios from 'axios';
import useOrderItemStore from '../../../_components/hooks/use-order-items';
import {request} from '@/api/axios';
import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useEffect, useState} from 'react';
import {
	Form,
	FormControl,
	FormDescription,
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

interface OrderTrackingProps {
	data: OrderItemWithDetails;
}
const updateStatusScema = z.object({
	status: z.string().min(1),
});
export function MarkItemCompleteFunction({data}: OrderTrackingProps) {
	const {resetOrderItem} = useOrderItemStore();
	const [loading, setLoading] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const handleModal = () => {
		setIsModalOpen(!isModalOpen);
	};
	const form = useForm<z.infer<typeof updateStatusScema>>({
		resolver: zodResolver(updateStatusScema),
		defaultValues: {
			status: '',
		},
		mode: 'onChange',
	});

	useEffect(() => {
		form.reset();
	}, []);
	const processForm = async (formData: z.infer<typeof updateStatusScema>) => {
		try {
			setLoading(true);
			resetOrderItem();
			await request(
				'POST',
				`api/v1/ims/order/${data.order_id}/order-items/${data.orderItem_id}/update_status`,
				formData,
			);
			toast.success(`${data.product.name} status changed`);
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

	return (
		<Dialog>
			<DialogTrigger>
				<Button>Mark Item Complete</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Confirm Item</DialogTitle>
					<DialogDescription>
						Mark sure you double check all items are all added to inventory.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(processForm)}
						className="space-y-3 px-5"
					>
						<FormField
							control={form.control}
							name={`status`}
							render={({field}) => (
								<FormItem>
									<FormLabel>Item Status</FormLabel>
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
													placeholder="Select a status"
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{orderItemStatus.map((data, key) => (
												<SelectItem key={key} value={data.toString()}>
													{data}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormDescription>
										This indicates the status of overall item status after
										tracking all items
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
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
