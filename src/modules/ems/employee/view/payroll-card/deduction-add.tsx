import {request} from '@/api/axios';
import {useEmployeeStore} from '@/components/hooks/use-employee-story';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
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
import {
	DeductionAddMore,
	deductionAddmoreSchema,
} from '@/lib/custom-form-schema';
import {cn} from '@/lib/util/utils';
import {zodResolver} from '@hookform/resolvers/zod';
import {Trash2Icon, AlertTriangleIcon} from 'lucide-react';
import {useState} from 'react';
import {useForm, useFieldArray} from 'react-hook-form';
import {toast} from 'sonner';

interface DeductionEditProps {
	onEditToggle: () => void;
}
export function DeductionAdd({onEditToggle}: DeductionEditProps) {
	const {selectedEmployee} = useEmployeeStore();
	const [loading, setLoading] = useState(false);

	const defaultValues = {
		deductions: [
			{
				name: '',
				start: '',
				end: '',
				frequency: '',
				deduction_type: '',
				amount: '',
				description: '',
			},
		],
	};

	const form = useForm<DeductionAddMore>({
		resolver: zodResolver(deductionAddmoreSchema),
		defaultValues,
		mode: 'onChange',
	});
	const {
		control,
		formState: {errors},
	} = form;

	const {fields, append, remove} = useFieldArray({
		control,
		name: 'deductions',
	});

	const frequency = [
		{id: 1, name: 'Daily'},
		{id: 2, name: 'Weekly'},
		{id: 3, name: 'Bi-Weekly'},
		{id: 4, name: 'Semi-Monthly'},
		{id: 5, name: 'Monthly'},
	];

	const deductionTypes = [
		{id: 1, name: 'Bonus'},
		{id: 2, name: 'Commission'},
		{id: 3, name: 'Overtime'},
		{id: 4, name: 'Other'},
	];
	const processForm = async (data: DeductionAddMore) => {
		setLoading(true);
		try {
			const deductionRequest = data.deductions.map((deduction) =>
				request(
					'POST',
					`/api/v1/ems/employees/${selectedEmployee?.employee_id}/deductions`,
					{
						...deduction,
						amount: Number(deduction.amount),
					},
				),
			);

			const responses = await Promise.allSettled(deductionRequest);

			const successfulRequests = responses.filter(
				(res) => res.status === 'fulfilled',
			);
			const failedRequests = responses.filter(
				(res) => res.status === 'rejected',
			);

			if (failedRequests.length > 0) {
				console.error('Some requests failed:', failedRequests);
				throw new Error(
					`${failedRequests.length} out of ${data.deductions.length} requests failed.`,
				);
			}

			console.log('All requests were successful:', successfulRequests);
			toast('All requests were successful');
			onEditToggle();
		} catch (error) {
			console.log(error);
			console.error('Error during form submission:', error);
			toast('Error during form submission', {
				description:
					error instanceof Error ? error.message : 'An unknown error occurred',
			});
		} finally {
			setLoading(true);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(processForm)}
				className="w-full space-y-8"
			>
				{fields?.map((field, index) => (
					<Card className="gap-5 flex flex-col p-5" key={index}>
						<Accordion
							type="single"
							collapsible
							defaultValue="item-1"
							key={field.id}
						>
							<AccordionItem value="item-1">
								<AccordionTrigger
									className={cn(
										'relative !no-underline [&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden',
										errors?.deductions?.[index] && 'text-red-700',
									)}
								>
									{field.deduction_id
										? `Deduction #${field.deduction_id}`
										: `New Benefits`}

									<Button
										variant="outline"
										size="icon"
										className="absolute right-8"
										onClick={() => remove(index)}
									>
										<Trash2Icon className="h-4 w-4 " />
									</Button>
									{errors?.deductions?.[index] && (
										<span className="alert absolute right-8">
											<AlertTriangleIcon className="h-4 w-4   text-red-700" />
										</span>
									)}
								</AccordionTrigger>
								<AccordionContent>
									<div
										className={cn(
											'relative mb-4 gap-8 rounded-md border p-4 md:grid md:grid-cols-3',
										)}
									>
										<FormField
											control={form.control}
											name={`deductions.${index}.name`}
											render={({field}) => (
												<FormItem>
													<FormLabel>Name</FormLabel>
													<FormControl>
														<Input
															type="text"
															disabled={loading}
															placeholder="e.g. Investment Account"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name={`deductions.${index}.start`}
											render={({field}) => (
												<FormItem>
													<FormLabel>Start end</FormLabel>
													<FormControl>
														<Input type="date" disabled={loading} {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name={`deductions.${index}.end`}
											render={({field}) => (
												<FormItem>
													<FormLabel>End date</FormLabel>
													<FormControl>
														<Input type="date" disabled={loading} {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name={`deductions.${index}.frequency`}
											render={({field}) => (
												<FormItem>
													<FormLabel>Frequency</FormLabel>
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
																	placeholder="Select a frequency"
																/>
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{frequency.map((data) => (
																<SelectItem key={data.id} value={data.name}>
																	{data.name}
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
											name={`deductions.${index}.deduction_type`}
											render={({field}) => (
												<FormItem>
													<FormLabel>Job country</FormLabel>
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
																	placeholder="Select a type"
																/>
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{deductionTypes.map((data) => (
																<SelectItem key={data.id} value={data.name}>
																	{data.name}
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
											name={`deductions.${index}.amount`}
											render={({field}) => (
												<FormItem>
													<FormLabel>Amount</FormLabel>
													<FormControl>
														<Input
															type="text"
															disabled={loading}
															placeholder="1000"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name={`deductions.${index}.description`}
											render={({field}) => (
												<FormItem>
													<FormLabel>Description (optional)</FormLabel>
													<FormControl>
														<Input
															type="text"
															disabled={loading}
															placeholder="Describe the benefits"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</Card>
				))}

				<div className="gap-5 flex justify-end ">
					<Button
						type="button"
						size={'lg'}
						onClick={() =>
							append({
								name: '',
								start: '',
								end: '',
								frequency: '',
								deduction_type: '',
								amount: '',
								description: '',
							})
						}
					>
						Add More
					</Button>
					<Button disabled={loading} size={'lg'} type="submit">
						Submit
					</Button>
					<Button
						onClick={() => onEditToggle()}
						disabled={loading}
						size={'lg'}
						type="submit"
						variant={'destructive'}
					>
						Cancel
					</Button>
				</div>
			</form>
		</Form>
	);
}
