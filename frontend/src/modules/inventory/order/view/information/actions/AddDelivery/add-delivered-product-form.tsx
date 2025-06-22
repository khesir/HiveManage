import {request} from '@/api/axios';
import {OrderLogs} from '@/components/interface/logs';
import {Button} from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {
	OrderProduct,
	orderProductSchema,
} from '@/components/validation/order-product';
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
	orderProduct: OrderProduct;
}

export function AddDeliveredProductForm({onSubmit, orderProduct}: Props) {
	const {user} = useEmployeeRoleDetailsStore();
	const [loading, setLoading] = useState<boolean>(false);
	const {id} = useParams();
	const {toggleTrigger} = useEventTrigger();

	const form = useForm<OrderProduct>({
		resolver: zodResolver(orderProductSchema),
		defaultValues: {
			unit_price: orderProduct.unit_price,
			total_quantity: orderProduct.total_quantity,
			ordered_quantity: orderProduct.ordered_quantity,
			product_id: orderProduct.product_id,
			delivered_quantity: orderProduct.delivered_quantity,
			order_id: orderProduct.order_id,
			status: orderProduct.status,
		},
		mode: 'onChange',
	});

	const processForm = async (data: OrderProduct) => {
		try {
			setLoading(true);
			const deliveredQuantity =
				data.delivered_quantity + orderProduct.delivered_quantity || 0;
			const orderedQuantity = data.total_quantity - deliveredQuantity;
			const totalQuantity = data.total_quantity || 0;
			if (orderedQuantity < 0) {
				toast.error('Order Quantity is 0');
				return;
			}
			if (deliveredQuantity === totalQuantity) {
				data.status = 'Delivered';
			} else if (deliveredQuantity > 0 && deliveredQuantity < totalQuantity) {
				data.status = 'Partially Delivered';
			} else if (deliveredQuantity === 0) {
				data.status = 'Awaiting Arrival';
			}
			if (!user?.employee.employee_id) {
				toast.error('You need to be logged in to proceed');
				return;
			}
			await request(
				'POST',
				`/api/v1/ims/order/${id}/order-product/${orderProduct.order_product_id}/delivery`,
				{
					...data,
					ordered_quantity: orderedQuantity,
					delivered_quantity: deliveredQuantity,
					user: user.employee.employee_id,
				},
			);
			await request('POST', `/api/v1/ims/orderlogs`, {
				order_id: data.order_id,
				product_id: data.product_id,
				order_item_id: orderProduct.order_product_id,
				total_quantity: data.total_quantity,
				ordered_quantity: orderedQuantity,
				delivered_quantity: deliveredQuantity,
				resolved_quantity: data.resolved_quantity,
				status: 'Delivered',
				action_type: 'Delivered',
				performed_by: user.employee.employee_id,
			} as unknown as OrderLogs);
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
	const orderedQty = form.getValues('ordered_quantity') || 0;

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(processForm)}
				className="w-full space-y-3"
			>
				<FormField
					control={form.control}
					name={`ordered_quantity`}
					render={({field}) => (
						<FormItem>
							<FormLabel>Ordered quantity</FormLabel>
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
					name={`delivered_quantity`}
					render={({field}) => (
						<FormItem>
							<FormLabel>Delivered quantity</FormLabel>
							<FormControl>
								<Input
									type="number"
									placeholder="Enter Delivered Quantity"
									value={field.value !== undefined ? field.value : ''}
									onChange={(e) => {
										let deliveredQty = parseInt(e.target.value);
										if (deliveredQty == null) {
											return;
										}
										// Prevent delivered from exceeding total
										if (deliveredQty > orderedQty) {
											deliveredQty = orderedQty;
										}

										// Ensure delivered is not negative
										if (deliveredQty < 0) {
											deliveredQty = 0;
										}

										// Update form values
										field.onChange(deliveredQty);
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
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
