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
import {useEmployeeRoleDetailsStore} from '@/modules/authentication/hooks/use-sign-in-userdata';
import useEventTrigger from '@/modules/inventory/_components/hooks/use-event-trigger';
import {zodResolver} from '@hookform/resolvers/zod';
import axios from 'axios';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';

interface Props {
	onSubmit?: () => void;
	orderProduct: OrderProduct;
}

export function UpdateOrderProductForm({onSubmit, orderProduct}: Props) {
	const {selectedOrder, loading, updateOrderItem} = useOrderStore();
	const {user} = useEmployeeRoleDetailsStore();
	const {toggleTrigger} = useEventTrigger();

	const form = useForm<OrderProduct>({
		resolver: zodResolver(orderProductSchema),
		defaultValues: {
			status: orderProduct.status,
			cost_price: orderProduct.cost_price,
			ordered_quantity: orderProduct.ordered_quantity,
			total_quantity: orderProduct.total_quantity,
			product_id: orderProduct.product_id,
		},
		mode: 'onChange',
	});

	const processForm = async (data: OrderProduct) => {
		try {
			if (!user?.employee.employee_id) {
				toast.error('You need to be logged in to proceed');
				return;
			}
			await updateOrderItem(
				selectedOrder.order_id!,
				orderProduct.order_product_id!,
				{
					...data,
					order_id: selectedOrder.order_id,
				},
				user?.employee.employee_id,
			);
			toast.success('Product Added');
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
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(processForm)}
				className="w-full space-y-3"
			>
				<pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>

				<FormField
					control={form.control}
					name={`ordered_quantity`}
					render={({field}) => (
						<FormItem>
							<FormLabel>Ordered quantity</FormLabel>
							<FormControl>
								<Input
									type="number"
									disabled={loading}
									placeholder="Select Value"
									value={field.value || ''}
									onChange={(e) => {
										const orderedQuantity = parseInt(e.target.value) || 0;
										field.onChange(orderedQuantity);
										form.setValue('total_quantity', orderedQuantity);
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name={`cost_price`}
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
