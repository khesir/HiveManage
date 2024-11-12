import {ApiRequest, request} from '@/api/axios';
import {Button} from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
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
import {Separator} from '@/components/ui/separator';
import {
	CreateEmployment,
	UpdateEmployment,
} from '@/modules/ems/_components/api/employee';
import {Department} from '@/modules/ems/_components/validation/department';
import {Designation} from '@/modules/ems/_components/validation/designation';
import {
	EmploymentInformation,
	employmentInformationSchema,
	EmploymentInformationWithDetails,
} from '@/modules/ems/_components/validation/employee';
import {EmployeeRolesWithDetails} from '@/modules/ems/_components/validation/employeeRoles';
import {zodResolver} from '@hookform/resolvers/zod';
import {useCallback, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
interface Props {
	selectedEmployee: EmployeeRolesWithDetails;
	onSubmit?: () => void;
}

export function EmploymentForm({selectedEmployee, onSubmit}: Props) {
	const [loading, setLoading] = useState<boolean>(false);
	const [employmentData, setEmploymentData] =
		useState<EmploymentInformationWithDetails>();

	useEffect(() => {
		const fetchEmploymentData = async () => {
			try {
				setLoading(true);
				const response = await request<
					ApiRequest<EmploymentInformationWithDetails[]>
				>(
					'GET',
					`api/v1/ems/employees/${selectedEmployee.employee.employee_id}/employmentInformation`,
				);
				const data = response.data as EmploymentInformationWithDetails[];
				setEmploymentData(data.length > 0 ? data[0] : undefined);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};
		if (selectedEmployee.employee.employee_id) {
			fetchEmploymentData();
		}
	}, [selectedEmployee.employee.employee_id]);

	const form = useForm<EmploymentInformation>({
		resolver: zodResolver(employmentInformationSchema),
		mode: 'onChange',
	});

	useEffect(() => {
		if (employmentData) {
			form.reset({
				department_id: employmentData.department?.department_id,
				designation_id: employmentData.designation?.designation_id,
				employee_type: employmentData.employee_type,
				employee_status: employmentData.employee_status,
			});
		}
	}, [employmentData, form]);

	const [department, setDepartment] = useState<Department[]>([]);
	const [designation, setDesignation] = useState<Designation[]>([]);
	const [submitLoading, setSubmitLoading] = useState<boolean>(false);

	const fetchMetaData = useCallback(async () => {
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
		} catch (error) {
			console.error(error);
		}
	}, []);

	useEffect(() => {
		fetchMetaData();
	}, [fetchMetaData]);

	const processForm = async (formData: EmploymentInformation) => {
		try {
			setSubmitLoading(true);
			if (!selectedEmployee.employee.employee_id)
				throw new Error('No Employee is selected');
			if (employmentData) {
				const response = await UpdateEmployment(
					formData,
					selectedEmployee.employee.employee_id,
					employmentData!.employment_information_id,
				);
				setEmploymentData(response);
			} else {
				const response = await CreateEmployment(
					formData,
					selectedEmployee.employee.employee_id,
				);
				setEmploymentData(response);
			}
			toast.success('Employment Information Successfully Added');
			if (onSubmit) {
				onSubmit();
			}
		} catch (error) {
			const msg =
				error instanceof Error ? error.message : 'An unknown error occurred';
			toast.error(msg);
			console.log(error);
		} finally {
			setSubmitLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center h-full items-center">loading..</div>
		);
	}
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

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Employment Information</h3>
				<p className="text-sm text-muted-foreground">
					This is where you can set your employment information such as type and
					status.
				</p>
			</div>
			<Separator />
			<Form {...form}>
				<form onSubmit={form.handleSubmit(processForm)} className="space-y-8">
					<FormField
						control={form.control}
						name="department_id"
						render={({field}) => (
							<FormItem>
								<FormLabel>Department</FormLabel>
								<Select
									disabled={submitLoading}
									onValueChange={(value) => field.onChange(Number(value))}
									value={field.value?.toString()}
									defaultValue={field.value?.toString()}
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
								<FormDescription>
									Employee&apos;s area of responsibility
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="designation_id"
						render={({field}) => (
							<FormItem>
								<FormLabel>Designation</FormLabel>
								<Select
									disabled={submitLoading}
									onValueChange={(value) => field.onChange(Number(value))}
									value={field.value?.toString()}
									defaultValue={field.value?.toString()}
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
												value={designation.designation_id?.toString() ?? ''}
											>
												{designation.title}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormDescription>
									Job role or the employee title
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="employee_type"
						render={({field}) => (
							<FormItem>
								<FormLabel>Employee Type</FormLabel>
								<Select
									disabled={submitLoading}
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
								<FormDescription>
									Choose a type of employee wheter, regular, seasonal,
									intern/temporary, or contractual
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="employee_status"
						render={({field}) => (
							<FormItem>
								<FormLabel>Employment Status</FormLabel>
								<Select
									disabled={submitLoading}
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
								<FormDescription>
									This determines the employment status of the employee
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>{' '}
					<div className="flex justify-end">
						<div className="space-x-2">
							<Button type="submit">Save</Button>
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
}
