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
import {Order, orderSchema} from '@/components/validation/order';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {DeleteOrder} from './delete-order';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {useEmployeeRoleDetailsStore} from '@/modules/authentication/hooks/use-sign-in-userdata';
import {toast} from 'sonner';
import useEventTrigger from '@/modules/inventory/_components/hooks/use-event-trigger';

export function UpdateOrderForm() {
	const {selectedOrder, loading, updateOrder} = useOrderStore();
	const {user} = useEmployeeRoleDetailsStore();
	const {toggleTrigger} = useEventTrigger();

	const form = useForm<Order>({
		resolver: zodResolver(orderSchema),
		defaultValues: {
			order_id: selectedOrder.order_id,
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
		if (!user?.employee.employee_id) {
			toast.error('You need to be logged in to proceed');
			return;
		}
		await updateOrder(
			selectedOrder.order_id!,
			data,
			user?.employee.employee_id,
		);
		toggleTrigger();
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
		<div className="space-y-5">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(processForm)}
					className="w-full space-y-3"
				>
					{/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}
					<div className="grid grid-cols-3 gap-5">
						<FormField
							control={form.control}
							name="expected_arrival"
							render={({field}) => (
								<FormItem>
									<FormLabel>Expected Arrival</FormLabel>
									<FormControl>
										<Input
											type="date"
											disabled={loading}
											placeholder="John"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name={`order_payment_status`}
							render={({field}) => (
								<FormItem>
									<FormLabel>Status</FormLabel>
									<Select
										disabled={loading}
										onValueChange={field.onChange}
										value={field.value || ''}
									>
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
									<FormLabel>Payment Method</FormLabel>
									<Select
										disabled={loading}
										onValueChange={field.onChange}
										value={field.value || ''}
									>
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
					</div>
					<FormField
						control={form.control}
						name="notes"
						render={({field}) => (
							<FormItem>
								<FormLabel>Note</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Additional information to be noted"
										{...field}
									/>
								</FormControl>
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
			<div className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4 shadow">
				<div>Just letting you know this exists</div>
				<DeleteOrder />
			</div>
		</div>
	);
}
