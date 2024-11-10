import {ApiRequest, request} from '@/api/axios';
import {useEmployeeStore} from '@/modules/ems/_components/hooks/use-employee-story';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {dateParser} from '@/lib/util/utils';
import {
	EmploymentInformation,
	employmentInformationSchema,
	EmploymentInformationWithDetails,
} from '@/modules/ems/_components/validation/employee';
import {useEffect, useState} from 'react';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {EmployeeRolesWithDetails} from '@/modules/ems/_components/validation/employeeRoles';

interface Props {
	selectedEmployee: EmployeeRolesWithDetails;
}

export function EmployeeForm({selectedEmployee}: Props) {
	const [res, setRes] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(false);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		if (!selectedEmployee || !selectedEmployee.employee.employee_id) return; // Guard clause

		const fetchEmploymentData = async () => {
			setLoading(true);
			try {
				const response = await request<
					ApiRequest<EmploymentInformationWithDetails[]>
				>(
					'GET',
					`api/v1/ems/employees/${selectedEmployee.employee.employee_id}/employmentInformation`,
				);
				const data = response.data as EmploymentInformationWithDetails[];
				console.log(data);
				if (data.length > 0) {
					setEmploymentData(data[0]);
				} else {
					setEmploymentData(undefined);
				}
			} catch (error) {
				if (error instanceof Error) {
					setRes(error.message);
				} else {
					setRes('Unknown Error has occurred');
				}
			} finally {
				setLoading(false);
			}
		};

		fetchEmploymentData();
	}, [selectedEmployee]); // Only depend on selectedEmployee

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	// Form
	const form = useForm<EmploymentInformation>({
		resolver: zodResolver(employmentInformationSchema),
		mode: 'onChange',
	});

	const handleEdit = () => {
		setIsEditing((prev) => !prev);
		if (employmentData) {
			form.reset({
				department_id:
					employmentData.department?.department_id?.toString() ?? '',
				designation_id:
					employmentData.designation?.designation_id?.toString() ?? '',
				employee_type: employmentData.employee_type as
					| 'Regular'
					| 'Probationary'
					| 'Contractual'
					| 'Seasonal'
					| 'Temporary',
				employee_status: employmentData.employee_status as
					| 'Active'
					| 'OnLeave'
					| 'Terminated'
					| 'Resigned'
					| 'Suspended'
					| 'Retired'
					| 'Inactive',
			});
		}
	};

	const [department, setDepartment] = useState<Department[]>([]);
	const [designation, setDesignation] = useState<Designation[]>([]);
	const [formLoading, setFormLoading] = useState<boolean>(false);
	const [submitLoading, setSubmitLoading] = useState<boolean>(false);
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

	useEffect(() => {
		if (isEditing) {
			setFormLoading(true);
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
					setFormLoading(false);
				}
			};
			fetchData();
		}
	}, [isEditing]);

	const processForm = async (formData: EmploymentInformation) => {
		try {
			setSubmitLoading(true);
			if (!selectedEmployee) {
				throw new Error('No Employee is selected');
			}
			if (employmentData) {
				// Update Employment Information
				await request(
					'PUT',
					`/api/v1/ems/employees/${selectedEmployee.employee.employee_id}/employmentInformation/${employmentData?.employment_information_id}`,
					{
						department_id: Number(formData?.department_id),
						designation_id: Number(formData?.designation_id),
						employee_type: formData?.employee_type,
						employee_status: formData?.employee_status,
					},
				);
			} else {
				// Create Employment Information
				await request(
					'POST',
					`/api/v1/ems/employees/${selectedEmployee.employee.employee_id}/employmentInformation/`,
					{
						department_id: Number(formData?.department_id),
						designation_id: Number(formData?.designation_id),
						employee_type: formData?.employee_type,
						employee_status: formData?.employee_status,
					},
				);
			}
			// Fetch new Employment Information
			const response = await request<
				ApiRequest<EmploymentInformationWithDetails[]>
			>(
				'GET',
				`api/v1/ems/employees/${selectedEmployee.employee.employee_id}/employmentInformation`,
			);
			const data = response.data as EmploymentInformationWithDetails[];

			if (data.length > 0) {
				setEmploymentData(data[0]);
			} else {
				setEmploymentData(undefined);
			}
		} catch (error) {
			toast('Error updating employment information:', {
				description:
					error instanceof Error ? error.message : 'An unknown error occurred',
			});
		} finally {
			setSubmitLoading(false);
			handleEdit();
		}
	};
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(processForm)}
				className="w-full space-y-2"
			>
				{formLoading ? (
					<div> Preparing form..</div>
				) : (
					<>
						<Card className="gap-8 md:grid md:grid-cols-3 p-5">
							<FormField
								control={form.control}
								name="department_id"
								render={({field}) => (
									<FormItem>
										<FormLabel>Department</FormLabel>
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
								name="designation_id"
								render={({field}) => (
									<FormItem>
										<FormLabel>Designation</FormLabel>
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
										<FormMessage />
									</FormItem>
								)}
							/>
						</Card>
						<div className="flex justify-end">
							<div className="space-x-2">
								<Button type="submit">Save</Button>
								<Button
									type="button"
									variant={'destructive'}
									onClick={handleEdit}
								>
									Cancel
								</Button>
							</div>
						</div>
					</>
				)}
			</form>
		</Form>
	);
}
