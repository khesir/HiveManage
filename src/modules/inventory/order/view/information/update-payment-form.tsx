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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {Order, orderSchema} from '@/components/validation/inventory/order';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';

interface Props {
	onSubmit?: () => void;
}

export function UpdatePaymentForm({onSubmit}: Props) {
	const {selectedOrder, loading, updateOrder, getOrderById} = useOrderStore();

	const form = useForm<Order>({
		resolver: zodResolver(orderSchema),
		defaultValues: {
			notes: selectedOrder.notes,
			expected_arrival: selectedOrder.expected_arrival,
			order_value: Number(selectedOrder.order_value),
			order_status: selectedOrder.order_status,
			order_payment_method: selectedOrder.order_payment_method,
			order_payment_status: selectedOrder.order_payment_status,
		},
		mode: 'onChange',
	});

	const processForm = async (data: Order) => {
		await updateOrder(selectedOrder.order_id!, data);
		if (onSubmit) {
			onSubmit();
		}
		getOrderById(selectedOrder.order_id!);
	};

	const orderPaymentStatus = ['Pending', 'Partially Paid', 'Paid'];
	const orderPaymentMethod = [
		'Cash',
		'Credit Card',
		'Bank Transfer',
		'Check',
		'Digital Wallet',
	];

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(processForm)}
				className="w-full space-y-3"
			>
				{/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}
				<FormField
					control={form.control}
					name={`order_payment_status`}
					render={({field}) => (
						<FormItem>
							<FormLabel>Ordered quantity</FormLabel>
							<Select
								disabled={loading}
								onValueChange={field.onChange}
								value={field.value || ''}
							>
								<FormLabel>Status</FormLabel>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select a Status" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{orderPaymentStatus.map((data, index) => (
										<SelectItem key={index} value={data}>
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
					name={`order_payment_method`}
					render={({field}) => (
						<FormItem>
							<FormLabel>Ordered quantity</FormLabel>
							<Select
								disabled={loading}
								onValueChange={field.onChange}
								value={field.value || ''}
							>
								<FormLabel>Status</FormLabel>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select a method" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{orderPaymentMethod.map((data, index) => (
										<SelectItem key={index} value={data}>
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
						Submit
					</Button>
				</div>
			</form>
		</Form>
	);
}
