/* eslint-disable @typescript-eslint/no-explicit-any */
import useCustomerFormStore from '@/modules/customer/_components/hooks/use-customer-form';
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
import {Separator} from '@/components/ui/separator';
import {cn} from '@/lib/util/utils';
import {zodResolver} from '@hookform/resolvers/zod';
import {Trash2Icon, AlertTriangleIcon} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useFieldArray, useForm} from 'react-hook-form';
import {toast} from 'sonner';
import {CreateCustomer} from '../../../../api/customer-api';
import {useNavigate} from 'react-router-dom';
import {Customer, customerSchema} from '@/components/validation/customer';

interface CreateCustomerFormProps {
	processCreate?: (data: Customer) => void;
}
export function CreateCustomerForm({processCreate}: CreateCustomerFormProps) {
	const [loading, setLoading] = useState(false);
	const [currentStep, setCurrentStep] = useState(0);
	const [, setPreviousStep] = useState(0);
	const navigate = useNavigate();
	const {setCustomerFormData, resetCustomerFormData} = useCustomerFormStore();

	useEffect(() => {
		resetCustomerFormData();
	}, []);

	const form = useForm<Customer>({
		resolver: zodResolver(customerSchema),
		defaultValues: {
			firstname: '',
			middlename: '',
			lastname: '',
			contact_phone: '',
			email: '',
			socials: [{type: '', link: ''}],
			addressline: '',
			barangay: '',
			province: '',
			standing: '',
			customer_id: undefined,
			created_at: undefined,
			last_updated: undefined,
			deleted_at: undefined,
		},
		mode: 'onChange',
	});
	const {
		control,
		formState: {errors},
	} = form;

	const {fields, append, remove} = useFieldArray({
		control: control,
		name: 'socials',
	});
	const steps = [
		{
			id: 'Step 1',
			name: 'Personal Information',
			fields: ['firstname', 'middlename', 'lastname', 'standing'],
		},
		{
			id: 'Step 2',
			name: 'Address Information',
			fields: ['addressline', 'barangay', 'province'],
		},
		{
			id: 'Step 3',
			name: 'Contact Information',
			fields: ['contact', 'email'],
		},
		{
			id: 'Step 4',
			name: 'Social Information',
			fields: fields
				.map((_, index) => [`socials.${index}.title`, `socials.${index}.type`])
				.flat(),
		},
		{
			id: 'Step 5',
			name: 'Complete',
		},
	];
	type FieldName = keyof Customer;

	const next = async () => {
		const fields = steps[currentStep].fields;

		const output = await form.trigger(fields as FieldName[], {
			shouldFocus: true,
		});
		const customerData: Customer = {
			firstname: form.getValues('firstname'),
			middlename: form.getValues('middlename'),
			lastname: form.getValues('lastname'),
			contact_phone: form.getValues('contact_phone'),
			email: form.getValues('email'),
			socials: form.getValues('socials'),
			addressline: form.getValues('addressline'),
			barangay: form.getValues('barangay'),
			standing: form.getValues('standing'),
			province: form.getValues('province'),
		};

		setCustomerFormData(customerData);
		if (!output) return;
		if (currentStep < steps.length - 1) {
			setPreviousStep(currentStep);
			setCurrentStep((step) => step + 1);
		}
	};

	const prev = () => {
		if (currentStep > 0) {
			setPreviousStep(currentStep);
			setCurrentStep((step) => step - 1);
		}
	};

	const processForm = async (data: Customer) => {
		try {
			setLoading(true);
			// Overview main transaction process
			// Don't touch
			if (typeof processCreate === 'function') {
				processCreate(data);
				return true;
			}

			// Saving process for default
			// ========================================
			await CreateCustomer(data);
			// ========================================
			toast('Customer Successfully Created!');
			navigate(-1);
		} catch (error) {
			toast('Error updating employment information:', {
				description:
					error instanceof Error ? error.message : 'An unknown error occurred',
			});
		}
		setLoading(false);
	};
	const socials = [
		'Facebook',
		'Twitter',
		'Instagram',
		'LinkedIn',
		'TikTok',
		'YouTube',
	];
	const standing = [
		'Active',
		'Inactive',
		'Pending',
		'Suspended',
		'Banned',
		'VIP',
		'Delinquent',
		'Prospect',
	];

	return (
		<div className="flex flex-col gap-5">
			<div>
				<ul className="flex gap-4">
					{steps.map((step, index) => (
						<li key={step.name} className="md:flex-1">
							{currentStep > index ? (
								<div className="group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
									<span className="text-sm font-medium text-sky-600 transition-colors ">
										{step.id}
									</span>
									<span className="text-sm font-medium">{step.name}</span>
								</div>
							) : currentStep === index ? (
								<div
									className="flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
									aria-current="step"
								>
									<span className="text-sm font-medium text-sky-600">
										{step.id}
									</span>
									<span className="text-sm font-medium">{step.name}</span>
								</div>
							) : (
								<div className="group flex h-full w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
									<span className="text-sm font-medium text-gray-500 transition-colors">
										{step.id}
									</span>
									<span className="text-sm font-medium">{step.name}</span>
								</div>
							)}
						</li>
					))}
				</ul>
			</div>
			<Separator />
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(processForm)}
					className="w-full space-y-8"
				>
					<Card className="gap-8 md:grid md:grid-cols-3 p-5">
						{currentStep === 0 && (
							<>
								<FormField
									control={form.control}
									name={`firstname`}
									render={({field}) => (
										<FormItem>
											<FormLabel>Firstname</FormLabel>
											<FormControl>
												<Input
													type="text"
													disabled={loading}
													placeholder="Firstname"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={`middlename`}
									render={({field}) => (
										<FormItem>
											<FormLabel>Middlename</FormLabel>
											<FormControl>
												<Input
													type="text"
													disabled={loading}
													placeholder="Middlename"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={`lastname`}
									render={({field}) => (
										<FormItem>
											<FormLabel>Lastname</FormLabel>
											<FormControl>
												<Input
													type="text"
													disabled={loading}
													placeholder="Firstname"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={`standing`}
									render={({field}) => (
										<FormItem>
											<FormLabel>Standing</FormLabel>
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
															placeholder="Select a standing"
														/>
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{standing.map((data, index) => (
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
							</>
						)}
						{currentStep === 1 && (
							<>
								<FormField
									control={form.control}
									name={`addressline`}
									render={({field}) => (
										<FormItem>
											<FormLabel>Address Line</FormLabel>
											<FormControl>
												<Input
													type="string"
													disabled={loading}
													placeholder="09123456789"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={`barangay`}
									render={({field}) => (
										<FormItem>
											<FormLabel>Address Line 2</FormLabel>
											<FormControl>
												<Input
													type="string"
													disabled={loading}
													placeholder="09123456789"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={`province`}
									render={({field}) => (
										<FormItem>
											<FormLabel>Province</FormLabel>
											<FormControl>
												<Input
													type="string"
													disabled={loading}
													placeholder="Metro Davao"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</>
						)}
						{currentStep === 2 && (
							<>
								<FormField
									control={form.control}
									name={`contact_phone`}
									render={({field}) => (
										<FormItem>
											<FormLabel>Contact</FormLabel>
											<FormControl>
												<Input
													type="string"
													disabled={loading}
													placeholder="09123456789"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={`email`}
									render={({field}) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													type="email"
													disabled={loading}
													placeholder="Firstname"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</>
						)}
						{currentStep === 3 && (
							<div className="flex flex-col gap-3 col-span-3">
								{fields.map((field, index) => (
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
													errors?.socials?.[index] && 'text-red-700',
												)}
											>
												{`Benefits #${index + 1}`}

												<Button
													variant="outline"
													size="icon"
													className="absolute right-8"
													onClick={() => remove(index)}
												>
													<Trash2Icon className="h-4 w-4 " />
												</Button>
												{errors?.socials?.[index] && (
													<span className="alert absolute right-8">
														<AlertTriangleIcon className="h-4 w-4   text-red-700" />
													</span>
												)}
											</AccordionTrigger>
											<AccordionContent className="px-3">
												<FormField
													control={form.control}
													name={`socials.${index}.type`}
													render={({field}) => (
														<FormItem>
															<FormLabel>Type</FormLabel>
															<FormControl>
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
																				placeholder="Select a Socials"
																			/>
																		</SelectTrigger>
																	</FormControl>
																	<SelectContent>
																		{socials.map((data, index) => (
																			<SelectItem key={index} value={data}>
																				{data}
																			</SelectItem>
																		))}
																	</SelectContent>
																</Select>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`socials.${index}.link`}
													render={({field}) => (
														<FormItem>
															<FormLabel>Link</FormLabel>
															<FormControl>
																<Input
																	type="url"
																	disabled={loading}
																	placeholder="Social Link (e.g., http://facebook.com/...)"
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</AccordionContent>
										</AccordionItem>
									</Accordion>
								))}
								<Button
									type="button"
									size={'lg'}
									onClick={() =>
										append({
											type: '',
											link: '',
										})
									}
								>
									Add More
								</Button>
							</div>
						)}
						{currentStep === 4 && (
							<div className="col-span-3 space-y-">
								<div className="flex flex-col gap-3 mb-5">
									<p className="text-lg font-semibold">Final Check</p>
									<p>
										Please review the Customer data and click this submit button
										to proceed
									</p>
								</div>
								<div className="flex justify-end">
									<Button type="submit">Submit</Button>
								</div>
							</div>
						)}
					</Card>
				</form>
			</Form>
			<div className=" pt-5">
				<div className="flex justify-between">
					<button
						type="button"
						onClick={prev}
						disabled={currentStep === 0}
						className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth="1.5"
							stroke="currentColor"
							className="h-6 w-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M15.75 19.5L8.25 12l7.5-7.5"
							/>
						</svg>
					</button>
					<button
						type="button"
						onClick={next}
						disabled={currentStep === steps.length - 1}
						className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth="1.5"
							stroke="currentColor"
							className="h-6 w-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M8.25 4.5l7.5 7.5-7.5 7.5"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
}
