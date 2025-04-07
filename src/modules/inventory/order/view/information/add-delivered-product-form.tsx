import useOrderStore from '@/api/order-state';
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
import {zodResolver} from '@hookform/resolvers/zod';
import axios from 'axios';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';

interface Props {
	onSubmit?: () => void;
	orderProduct: OrderProduct;
}

export function AddDeliveredProductForm({onSubmit, orderProduct}: Props) {
	const {selectedOrder, loading, updateOrderItem, getOrderById} =
		useOrderStore();

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
			const deliveredQuantity = data.delivered_quantity || 0;
			const totalQuantity = data.total_quantity || 0;

			if (deliveredQuantity === totalQuantity) {
				data.status = 'Delivered';
			} else if (deliveredQuantity > 0 && deliveredQuantity < totalQuantity) {
				data.status = 'Partially Delivered';
			} else if (deliveredQuantity === 0) {
				data.status = 'Awaiting Arrival';
			}
			await updateOrderItem(
				selectedOrder.order_id!,
				orderProduct.order_product_id!,
				{
					...data,
					order_id: selectedOrder.order_id,
				},
			);
			if (onSubmit) {
				onSubmit();
			}
			getOrderById(selectedOrder.order_id!);
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
										let deliveredQty = parseInt(e.target.value) || 0;
										const totalQty = form.getValues('total_quantity') || 0;

										// Prevent delivered from exceeding total
										if (deliveredQty > totalQty) {
											deliveredQty = totalQty;
										}

										// Ensure delivered is not negative
										if (deliveredQty < 0) {
											deliveredQty = 0;
										}

										// Auto-adjust ordered quantity
										const orderedQty = totalQty - deliveredQty;

										// Update form values
										field.onChange(deliveredQty);
										form.setValue('ordered_quantity', orderedQty);
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
