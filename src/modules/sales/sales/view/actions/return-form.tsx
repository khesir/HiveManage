import {request} from '@/api/axios';
import {Button} from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {SalesItem, salesItemSchema} from '@/components/validation/sales_item';
import {useEmployeeRoleDetailsStore} from '@/modules/authentication/hooks/use-sign-in-userdata';
import useEventTrigger from '@/modules/inventory/_components/hooks/use-event-trigger';
import {zodResolver} from '@hookform/resolvers/zod';
import axios from 'axios';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {useParams} from 'react-router-dom';
import {toast} from 'sonner';

interface Props {
	onSubmit?: () => void;
	salesItem: SalesItem;
}

export function ReturnForm({onSubmit, salesItem}: Props) {
	const {user} = useEmployeeRoleDetailsStore();
	const [loading, setLoading] = useState<boolean>(false);
	const {id} = useParams();
	const {toggleTrigger} = useEventTrigger();

	const form = useForm<SalesItem>({
		resolver: zodResolver(salesItemSchema),
		defaultValues: {
			product_id: salesItem.product_id,
			sales_id: salesItem.sales_id,
			quantity: salesItem.quantity,
			sold_price: salesItem.sold_price,
			return_qty: salesItem.return_qty,
			refund_amount: salesItem.refund_amount,
			return_note: salesItem.return_note,
			warranty_date: salesItem.warranty_date,
			user_id: user?.employee.employee_id,
		},
		mode: 'onSubmit',
	});

	const processForm = async (formData: SalesItem) => {
		try {
			setLoading(true);
			if (formData.return_qty! <= 0) {
				toast.error('Order Quantity is 0');
				return;
			}
			if (!user?.employee.employee_id) {
				toast.error('You need to be logged in to proceed');
				return;
			}
			await request(
				'PUT',
				`/api/v1/sms/sales/${id}/sales_items/${salesItem.sales_items_id!}/return`,
				formData,
			);
			if (onSubmit) {
				onSubmit();
			}
			toggleTrigger();
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
			setLoading(true);
		}
	};
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(processForm)}
				className="w-full space-y-3"
			>
				<FormField
					control={form.control}
					name={`quantity`}
					render={({field}) => (
						<FormItem>
							<FormLabel>Sold quantity</FormLabel>
							<FormControl>
								<Input
									type="number"
									disabled={true}
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
					name={`refund_amount`}
					render={({field}) => (
						<FormItem>
							<FormLabel>Refund Amount</FormLabel>
							<FormControl>
								<Input
									type="number"
									disabled={true}
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
					name={`return_qty`}
					render={({field}) => (
						<FormItem>
							<FormLabel>Return quantity</FormLabel>
							<FormControl>
								<Input
									type="number"
									placeholder="Enter Delivered Quantity"
									value={field.value !== undefined ? field.value : ''}
									onChange={(e) => {
										let returnQty = parseInt(e.target.value);
										if (returnQty == null) {
											return;
										}
										// Prevent return from exceeding total
										if (returnQty >= salesItem.quantity) {
											returnQty = salesItem.quantity;
										}

										// Ensure delivered is not negative
										if (returnQty < 0) {
											returnQty = 0;
										}

										// Update form values
										field.onChange(returnQty);
										form.setValue(
											'refund_amount',
											returnQty * salesItem.sold_price,
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
					name="return_note"
					render={({field}) => (
						<FormItem>
							<FormLabel>Reason</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									disabled={loading}
									placeholder="Write Reason for Refund"
									value={field.value ?? ''}
								/>
							</FormControl>
							<FormDescription>* Required</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>

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
