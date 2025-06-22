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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {OrderProduct} from '@/components/validation/order-product';
import {useEmployeeRoleDetailsStore} from '@/modules/authentication/hooks/use-sign-in-userdata';
import useEventTrigger from '@/modules/inventory/_components/hooks/use-event-trigger';
import {zodResolver} from '@hookform/resolvers/zod';
import axios from 'axios';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {useParams} from 'react-router-dom';
import {toast} from 'sonner';
import {z} from 'zod';

interface Props {
	onSubmit?: () => void;
	orderProduct: OrderProduct;
}
const resolveSchema = z.object({
	delivered_quantity: z.number(),
	resolved_quantity: z.number(),
	resolve_type: z.enum(['Replaced', 'Refunded', 'Discounted', 'Cancelled']),
});
export function AddResolveProductForm({onSubmit, orderProduct}: Props) {
	const {user} = useEmployeeRoleDetailsStore();
	const [loading, setLoading] = useState<boolean>(false);
	const {id} = useParams();
	const {toggleTrigger} = useEventTrigger();

	const form = useForm<z.infer<typeof resolveSchema>>({
		resolver: zodResolver(resolveSchema),
		defaultValues: {
			delivered_quantity: orderProduct.delivered_quantity,
			resolved_quantity: orderProduct.resolved_quantity,
		},
		mode: 'onSubmit',
	});

	const processForm = async (data: z.infer<typeof resolveSchema>) => {
		try {
			setLoading(true);
			if (deliveredQty < 0) {
				toast.error('Delivered Quantity is 0');
				return;
			}

			if (!user?.employee.employee_id) {
				toast.error('You need to be logged in to proceed');
				return;
			}

			if (data.resolve_type === 'Replaced') {
				const orderedQty =
					orderProduct.ordered_quantity + data.resolved_quantity;
				const deliveredQty =
					orderProduct.delivered_quantity - data.resolved_quantity;
				let status = 'Delivered';
				if (deliveredQty === orderProduct.total_quantity) {
					status = 'Delivered';
				} else if (
					deliveredQty > 0 &&
					deliveredQty < orderProduct.total_quantity
				) {
					status = 'Partially Delivered';
				} else if (deliveredQty === 0) {
					status = 'Awaiting Arrival';
				}
				await request(
					'POST',
					`/api/v1/ims/order/${id}/order-product/${orderProduct.order_product_id}/resolve`,
					{
						...orderProduct,
						status: status,
						ordered_quantity: orderedQty,
						delivered_quantity: deliveredQty,
						user: user.employee.employee_id,
					},
				);

				await request('POST', `/api/v1/ims/orderlogs`, {
					order_id: orderProduct.order_id,
					product_id: orderProduct.product_id,
					order_item_id: orderProduct.order_product_id,
					total_quantity: orderProduct.total_quantity,
					ordered_quantity: orderedQty,
					delivered_quantity: deliveredQty,
					resolved_quantity: orderProduct.resolved_quantity,
					status: 'Resolved',
					action_type: 'Resolved',
					resolve_type: data.resolve_type,
					performed_by: user.employee.employee_id,
				} as unknown as OrderLogs);
			} else {
				const resolveQuantity =
					Number(data.resolved_quantity) + orderProduct.resolved_quantity || 0;
				const deliveredQty = orderProduct.delivered_quantity - resolveQuantity;

				await request(
					'POST',
					`/api/v1/ims/order/${id}/order-product/${orderProduct.order_product_id}/resolve`,
					{
						...orderProduct,
						delivered_quantity: deliveredQty,
						resolved_quantity: resolveQuantity,
						user: user.employee.employee_id,
					},
				);

				await request('POST', `/api/v1/ims/orderlogs`, {
					order_id: orderProduct.order_id,
					product_id: orderProduct.product_id,
					order_item_id: orderProduct.order_product_id,
					total_quantity: orderProduct.total_quantity,
					ordered_quantity: orderProduct.ordered_quantity,
					delivered_quantity: deliveredQty,
					resolved_quantity: resolveQuantity,
					status: 'Resolved',
					action_type: 'Resolved',
					resolve_type: data.resolve_type,
					performed_by: user.employee.employee_id,
				} as unknown as OrderLogs);
			}
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
	const resolveList = ['Replaced', 'Refunded', 'Discounted', 'Cancelled'];
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
							<FormLabel>Resolve quantity</FormLabel>
							<FormControl>
								<Input
									type="number"
									placeholder="Enter Resolve Quantity"
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
				<FormField
					control={form.control}
					name="resolve_type"
					render={({field}) => (
						<FormItem>
							<FormLabel>Resolve Type</FormLabel>
							<Select
								disabled={loading}
								onValueChange={(value) => field.onChange(value)}
								value={field.value?.toString()}
								defaultValue={field.value?.toString()}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue
											defaultValue={field.value}
											placeholder="Select a Resolve Type"
										/>
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{resolveList.map((data, key) => (
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
