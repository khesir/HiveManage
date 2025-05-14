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
import {Card} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Payment, paymentSchema} from '@/components/validation/payment';
import {useSalesHook} from '@/components/hooks/use-sales-hook';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {useState} from 'react';

interface Props {
	process: (data: Payment) => void;
	loading: boolean;
}

export function CreatePaymentForm({process, loading}: Props) {
	const {salesHookData} = useSalesHook();
	const [totalValue] = useState<number>(() =>
		Math.round(
			salesHookData.reduce(
				(total, item) =>
					total + (item.data.selling_price || 0) * (item.quantity || 0),
				0,
			),
		),
	);
	const form = useForm<Payment>({
		resolver: zodResolver(paymentSchema),
		defaultValues: {
			amount: totalValue,
			payment_type: 'Service',
			payment_date: Date.now().toString(),
			vat_amount: 0,
			discount_amount: 0,
		},
		mode: 'onChange',
	});
	const processForm = (data: Payment) => {
		if ((data.change_amount ?? 0) > 0) {
			form.setError('change_amount', {
				type: 'manual',
				message: 'Change amount cannot be more than 0',
			});
			return;
		}
		process(data);
	};
	const paymentMethod = ['Cash', 'Card', 'Online Payment'];

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(processForm)}
				className=" space-y-3 h-full"
			>
				<div className="flex flex-col md:flex-row gap-5 items-center">
					<Card className="flex flex-col gap-5 p-5 md:flex-[1_1_70%] min-w-[300px]">
						<p className="text-lg font-semibold">Payment Form</p>
						<div className="flex flex-col gap-5">
							<div className="flex-1 gap-3 flex flex-col h-full">
								<FormField
									control={form.control}
									name="payment_method"
									render={({field}) => (
										<FormItem>
											<FormLabel>Method</FormLabel>
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
													{paymentMethod.map((data, index) => (
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
								<div className="flex gap-5 justify-between">
									<FormField
										control={form.control}
										name="vat_amount"
										render={({field}) => (
											<FormItem>
												<FormLabel>VAT Amount</FormLabel>
												<FormControl>
													<Input
														type="number"
														{...field}
														disabled={true}
														placeholder="123123"
														onChange={(e) => {
															const value = e.target.value;
															// Ensure the value is converted to a number
															field.onChange(value ? parseFloat(value) : 0);
														}}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="discount_amount"
										render={({field}) => (
											<FormItem>
												<FormLabel>Discount Amount</FormLabel>
												<FormControl>
													<Input
														type="number"
														{...field}
														disabled={loading}
														placeholder="123123"
														onChange={(e) => {
															const value = parseFloat(e.target.value);
															field.onChange(value);
															if (value) {
																const newVal = totalValue - value;
																form.setValue('amount', newVal);
															}
														}}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<FormField
									control={form.control}
									name="paid_amount"
									render={({field}) => (
										<FormItem>
											<FormLabel>Paid Amount</FormLabel>
											<FormControl>
												<Input
													type="number"
													{...field}
													disabled={loading}
													placeholder="Enter Paid Amount"
													onChange={(e) => {
														const value = parseFloat(e.target.value);
														field.onChange(value);
														const totalVal = form.getValues();
														if (value) {
															const newVal = totalVal.amount - value;
															form.setValue('change_amount', newVal);
														}
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="reference_number"
									render={({field}) => (
										<FormItem>
											<FormLabel>Ref #</FormLabel>
											<FormControl>
												<Input
													type="number"
													{...field}
													disabled={loading}
													placeholder="1234-5678"
													onChange={(e) => {
														field.onChange(e.target.value);
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className="flex gap-5 justify-between">
									<FormField
										control={form.control}
										name="amount"
										render={({field}) => (
											<FormItem>
												<FormLabel>Total Price</FormLabel>
												<FormControl>
													<Input
														type="number"
														{...field}
														disabled={true}
														placeholder="123123"
														onChange={(e) => {
															const value = e.target.value;
															// Ensure the value is converted to a number
															field.onChange(value ? parseFloat(value) : 0);
														}}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="change_amount"
										render={({field}) => (
											<FormItem>
												<FormLabel>Change</FormLabel>
												<FormControl>
													<Input
														type="number"
														{...field}
														disabled={true}
														placeholder="123123"
														onChange={(e) => {
															const value = e.target.value;
															// Ensure the value is converted to a number
															field.onChange(value ? parseFloat(value) : 0);
														}}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
							<Button
								disabled={loading}
								type="submit"
								className="bg-green-400 hover:bg-green-400"
							>
								Submit
							</Button>
						</div>
					</Card>
				</div>
			</form>
			{/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}
		</Form>
	);
}
