import {Card} from '@/components/ui/card';
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	Form,
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

import {
	employeeFormSchema,
	EmployeeFormSchema,
} from '@/modules/ems/_components/validation/employee-custom-form-schema';
import {Department, Designation} from '@/modules/ems/_components/validation/employee-zod-schema';
import {zodResolver} from '@hookform/resolvers/zod';
import {useEffect, useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {CreateEmployeeProcess} from './create-employee-process';
import useEmployeeFormStore from '@/components/hooks/use-create-employee-view';
import {ApiRequest, request} from '@/api/axios';

export function CreateEmployeeForm() {
	const [previousStep, setPreviousStep] = useState(0);
	const [currentStep, setCurrentStep] = useState(0);
	const [loading, setLoading] = useState(false);
	const [res, setRes] = useState<string | null>(null);
	const {setEmployeeFormData} = useEmployeeFormStore();
	const defaultValues = {
		employeeBasicInformation: {
			firstname: '',
			middlename: '',
			lastname: '',
		},
		personalInformation: {
			birthday: '',
			gender: 'Male' as 'Male' | 'Female',
			phone: '',
			email: '',
			address_line: '',
			postal_code: '',
		},
		employmentInformation: {
			department_id: '',
			designation_id: '',
			employee_type: 'Regular' as
				| 'Regular'
				| 'Probationary'
				| 'Contractual'
				| 'Seasonal'
				| 'Temporary',
			employee_status: 'Active' as
				| 'Active'
				| 'Terminated'
				| 'OnLeave'
				| 'Resigned'
				| 'Suspended'
				| 'Retired'
				| 'Inactive',
		},
		salaryInformation: {
			payroll_frequency: 'Monthly' as
				| 'Daily'
				| 'Weekly'
				| 'Bi Weekly'
				| 'Semi Monthly'
				| 'Monthly',
			base_salary: '0',
		},
		financialInformation: {
			pag_ibig_id: '',
			sss_id: '',
			philhealth_id: '',
			tin: '',
			bank_account_number: '',
		},
	};

	const form = useForm<EmployeeFormSchema>({
		resolver: zodResolver(employeeFormSchema),
		defaultValues,
		mode: 'onChange',
	});

	const steps = [
		{
			id: 'Step 1',
			name: 'Basic Information',
			fields: [
				'employeeBasicInformation.firstname',
				'employeeBasicInformation.middlename',
				'employeeBasicInformation.lastname',
			],
		},
		{
			id: 'Step 2',
			name: 'Personal Information',
			fields: [
				'personalInformation.birthday',
				'personalInformation.gender',
				'personalInformation.phone',
				'personalInformation.email',
				'personalInformation.address_line',
				'personalInformation.postal_code',
			],
		},
		{
			id: 'Step 3',
			name: 'Employment Information',
			fields: [
				'employmentInformation.department',
				'employmentInformation.designation',
				'employmentInformation.employee_type',
				'employmentInformation.employee_status',
			],
		},
		{
			id: 'Step 4',
			name: 'Salary Information',
			fields: [
				'salaryInformation.payroll_frequency',
				'salaryInformation.base_salary',
			],
		},
		{
			id: 'Step 5',
			name: 'Financial Information',
			fields: [
				'financialInformation.pag_ibig_id',
				'financialInformation.sss_id',
				'financialInformation.philhealth_id',
				'financialInformation.tin',
				'financialInformation.bank_account_number',
			],
		},
		{id: 'Step 6', name: 'Complete'},
	];

	const processForm: SubmitHandler<EmployeeFormSchema> = (data) => {
		console.log('data ==>', data);
	};

	type FieldName = keyof EmployeeFormSchema;

	const next = async () => {
		const fields = steps[currentStep].fields;

		const output = await form.trigger(fields as FieldName[], {
			shouldFocus: true,
		});

		if (!output) return;

		const organizedData = {
			employeeBasicInformation: {
				firstname: form.getValues('employeeBasicInformation.firstname'),
				middlename: form.getValues('employeeBasicInformation.middlename'),
				lastname: form.getValues('employeeBasicInformation.lastname'),
			},
			personalInformation: {
				birthday: form.getValues('personalInformation.birthday'),
				gender: form.getValues('personalInformation.gender'),
				phone: form.getValues('personalInformation.phone'),
				email: form.getValues('personalInformation.email'),
				address_line: form.getValues('personalInformation.address_line'),
				postal_code: form.getValues('personalInformation.postal_code'),
			},
			employmentInformation: {
				department_id: form.getValues('employmentInformation.department_id'),
				designation_id: form.getValues('employmentInformation.designation_id'),
				employee_type: form.getValues('employmentInformation.employee_type'),
				employee_status: form.getValues(
					'employmentInformation.employee_status',
				),
			},
			salaryInformation: {
				payroll_frequency: form.getValues(
					'salaryInformation.payroll_frequency',
				),
				base_salary: form.getValues('salaryInformation.base_salary'),
			},
			financialInformation: {
				pag_ibig_id: form.getValues('financialInformation.pag_ibig_id'),
				sss_id: form.getValues('financialInformation.sss_id'),
				philhealth_id: form.getValues('financialInformation.philhealth_id'),
				tin: form.getValues('financialInformation.tin'),
				bank_account_number: form.getValues(
					'financialInformation.bank_account_number',
				),
			},
		};
		setEmployeeFormData(organizedData);
		if (currentStep < steps.length - 1) {
			if (currentStep === steps.length - 2) {
				await form.handleSubmit(processForm)();
			}
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
	const [department, setDepartment] = useState<Department[]>([]);
	const [designation, setDesignation] = useState<Designation[]>([]);

	useEffect(() => {
		setLoading(true);
		const fetchData = async () => {
			try {
				const [departmentResponse, designationResponse] = await Promise.all([
					request<ApiRequest<Department>>('GET', '/api/v1/ems/departments'),
					request<ApiRequest<Designation>>('GET', '/api/v1/ems/designations'),
				]);
				setDepartment(
					Array.isArray(departmentResponse.data)
						? departmentResponse.data
						: [departmentResponse.data],
				);
				setDesignation(
					Array.isArray(designationResponse.data)
						? designationResponse.data
						: [designationResponse.data],
				);
			} catch (e) {
				console.log(e);
				if (e instanceof Error) {
					setRes(e.toString());
				} else {
					setRes('An unknown error occurred');
				}
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const gender = [
		{id: 1, name: 'Male'},
		{id: 2, name: 'Female'},
	];

	const employee_type = [
		{id: 1, name: 'Regular'},
		{id: 2, name: 'Probationary'},
		{id: 3, name: 'Contractual'},
		{id: 4, name: 'Seasonal'},
		{id: 5, name: 'Temporary'},
	];

	const employee_status = [
		{id: 1, name: 'Active'},
		{id: 2, name: 'Terminated'},
		{id: 3, name: 'On Leave'},
		{id: 4, name: 'Resigned'},
		{id: 5, name: 'Suspended'},
		{id: 6, name: 'Retired'},
		{id: 7, name: 'Inactive'},
	];

	const payroll_frequency = [
		{id: 1, name: 'Daily'},
		{id: 2, name: 'Weekly'},
		{id: 3, name: 'Bi-Weekly'},
		{id: 4, name: 'Semi-Monthly'},
		{id: 5, name: 'Monthly'},
	];
	if (res) {
		return <div> {res} </div>;
	}
	if (loading) {
		return <div>Fechting data...</div>;
	}
	return (
		<>
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
									name="employeeBasicInformation.firstname"
									render={({field}) => (
										<FormItem>
											<FormLabel>First Name</FormLabel>
											<FormControl>
												<Input
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
									name="employeeBasicInformation.middlename"
									render={({field}) => (
										<FormItem>
											<FormLabel>Middle Name</FormLabel>
											<FormControl>
												<Input
													disabled={loading}
													placeholder="Mike (Optional)"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="employeeBasicInformation.lastname"
									render={({field}) => (
										<FormItem>
											<FormLabel>Last Name</FormLabel>
											<FormControl>
												<Input
													disabled={loading}
													placeholder="Doe"
													{...field}
												/>
											</FormControl>
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
									name="personalInformation.gender"
									render={({field}) => (
										<FormItem>
											<FormLabel>Gender</FormLabel>
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
															placeholder="Select a country"
														/>
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{gender.map((gender) => (
														<SelectItem key={gender.id} value={gender.name}>
															{gender.name}
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
									name="personalInformation.email"
									render={({field}) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													disabled={loading}
													placeholder="johndoe@gmail.com"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="personalInformation.phone"
									render={({field}) => (
										<FormItem>
											<FormLabel>Contact Number</FormLabel>
											<FormControl>
												<Input
													disabled={loading}
													type="number"
													placeholder="Enter you contact number"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="personalInformation.birthday"
									render={({field}) => (
										<FormItem>
											<FormLabel>Birthday</FormLabel>
											<FormControl>
												<Input type="date" disabled={loading} {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="personalInformation.address_line"
									render={({field}) => (
										<FormItem>
											<FormLabel>Address Line</FormLabel>
											<FormControl>
												<Input
													disabled={loading}
													placeholder="Full Address"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="personalInformation.postal_code"
									render={({field}) => (
										<FormItem>
											<FormLabel>Postal code</FormLabel>
											<Input disabled={loading} placeholder="Code" {...field} />
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
									name="employmentInformation.department_id"
									render={({field}) => (
										<FormItem>
											<FormLabel>Department</FormLabel>
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
															placeholder="Select a Department"
														/>
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{department.map((department, key) => (
														<SelectItem
															key={key}
															value={department.department_id?.toString() ?? ''}
														>
															{department.name}
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
									name="employmentInformation.designation_id"
									render={({field}) => (
										<FormItem>
											<FormLabel>Designation</FormLabel>
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
															placeholder="Select a Designation"
														/>
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{designation.map((designation, index) => (
														<SelectItem
															key={index}
															value={
																designation.designation_id?.toString() ?? ''
															}
														>
															{designation.title}
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
									name="employmentInformation.employee_type"
									render={({field}) => (
										<FormItem>
											<FormLabel>Employee Type</FormLabel>
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
															placeholder="Select a country"
														/>
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{employee_type.map((employee_type) => (
														<SelectItem
															key={employee_type.id}
															value={employee_type.name}
														>
															{employee_type.name}
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
									name="employmentInformation.employee_status"
									render={({field}) => (
										<FormItem>
											<FormLabel>Employment Status</FormLabel>
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
															placeholder="Select a country"
														/>
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{employee_status.map((employee_status) => (
														<SelectItem
															key={employee_status.id}
															value={employee_status.name}
														>
															{employee_status.name}
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
						{currentStep === 3 && (
							<>
								<FormField
									control={form.control}
									name="salaryInformation.payroll_frequency"
									render={({field}) => (
										<FormItem>
											<FormLabel>Payroll Frequency</FormLabel>
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
															placeholder="Select a Frequency"
														/>
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{payroll_frequency.map((payroll_frequency) => (
														<SelectItem
															key={payroll_frequency.id}
															value={payroll_frequency.name}
														>
															{payroll_frequency.name}
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
									name="salaryInformation.base_salary"
									render={({field}) => (
										<FormItem>
											<FormLabel>Base Salary</FormLabel>
											<FormControl>
												<Input
													disabled={loading}
													placeholder="Base salary"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</>
						)}
						{currentStep === 4 && (
							<>
								<FormField
									control={form.control}
									name="financialInformation.pag_ibig_id"
									render={({field}) => (
										<FormItem>
											<FormLabel>Pag Ibig ID</FormLabel>
											<FormControl>
												<Input
													disabled={loading}
													placeholder="1234"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="financialInformation.sss_id"
									render={({field}) => (
										<FormItem>
											<FormLabel>SSS ID</FormLabel>
											<FormControl>
												<Input
													disabled={loading}
													placeholder="1234"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="financialInformation.philhealth_id"
									render={({field}) => (
										<FormItem>
											<FormLabel>Philhealth</FormLabel>
											<FormControl>
												<Input
													disabled={loading}
													placeholder="1234"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="financialInformation.tin"
									render={({field}) => (
										<FormItem>
											<FormLabel>TIN ID</FormLabel>
											<FormControl>
												<Input
													disabled={loading}
													placeholder="1234"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="financialInformation.bank_account_number"
									render={({field}) => (
										<FormItem>
											<FormLabel>Bank Account Number</FormLabel>
											<FormControl>
												<Input
													disabled={loading}
													placeholder="1234
                          "
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</>
						)}
						{currentStep === 5 && (
							<>
								<h1 className="font-bold col-span-3">
									Confirm the Data on the given page
								</h1>
								<div className="flex flex-col col-span-3 items-center gap-5">
									<CreateEmployeeProcess />
								</div>
							</>
						)}
					</Card>

					{/* <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button> */}
				</form>
			</Form>
			<div className="mt-8 pt-5">
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
		</>
	);
}
