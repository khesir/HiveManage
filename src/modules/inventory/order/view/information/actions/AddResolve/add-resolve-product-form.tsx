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

export function AddResolveProductForm({onSubmit, orderProduct}: Props) {
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
			resolved_quantity: orderProduct.resolved_quantity,
			order_id: orderProduct.order_id,
			status: orderProduct.status,
		},
		mode: 'onChange',
	});

	const processForm = async (data: OrderProduct) => {
		try {
			setLoading(true);
			const resolveQuantity =
				data.resolved_quantity + orderProduct.resolved_quantity || 0;
			const orderedQuantity = data.delivered_quantity - resolveQuantity;
			if (orderedQuantity < 0) {
				toast.error('Delivered Quantity is 0');
				return;
			}

			if (!user?.employee.employee_id) {
				toast.error('You need to be logged in to proceed');
				return;
			}
			await request(
				'POST',
				`/api/v1/ims/order/${id}/order-product/${orderProduct.order_product_id}/resolve`,
				{
					...data,
					resolved_quantity: resolveQuantity,
					user: user.employee.employee_id,
				},
			);
			await request('POST', `/api/v1/ims/orderlogs`, {
				order_id: data.order_id,
				product_id: data.product_id,
				order_item_id: orderProduct.order_product_id,
				total_quantity: data.total_quantity,
				ordered_quantity: data.ordered_quantity,
				resolved_quantity: resolveQuantity,
				status: 'resolve',
				action_type: 'resolve',
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
	const deliveredQty = form.getValues('delivered_quantity') || 0;

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(processForm)}
				className="w-full space-y-3"
			>
				<FormField
					control={form.control}
					name={`delivered_quantity`}
					render={({field}) => (
						<FormItem>
							<FormLabel>Delivered quantity</FormLabel>
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
					name={`resolved_quantity`}
					render={({field}) => (
						<FormItem>
							<FormLabel>resolve quantity</FormLabel>
							<FormControl>
								<Input
									type="number"
									placeholder="Enter resolve Quantity"
									value={field.value !== undefined ? field.value : ''}
									onChange={(e) => {
										let resolveQty = parseInt(e.target.value);
										if (resolveQty == null) {
											return;
										}
										// Prevent resolve from exceeding total
										if (resolveQty > deliveredQty) {
											resolveQty = deliveredQty;
										}

										// Ensure resolve is not negative
										if (resolveQty < 0) {
											resolveQty = 0;
										}

										// Update form values
										field.onChange(resolveQty);
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
