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
import {
	employeeFormSchema,
	EmployeeFormSchema,
} from '@/modules/ems/_components/validation/custom-validation';
import {zodResolver} from '@hookform/resolvers/zod';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {ApiRequest, request} from '@/api/axios';
import {Department} from '../../_components/validation/department';
import {Designation} from '../../_components/validation/designation';
import {Position} from '../../_components/validation/position';
import {Button} from '@/components/ui/button';
import {Role} from '../../_components/validation/role';
import {appendFormData} from '@/lib/util/utils';
import {AxiosError} from 'axios';
import {toast} from 'sonner';
import {Skeleton} from '@/components/ui/skeleton';
import {useNavigate} from 'react-router-dom';

export function CreateEmployeeForm() {
	const [loading, setLoading] = useState(false);
	const [res, setRes] = useState<string | null>(null);
	const navigate = useNavigate();
	const [department, setDepartment] = useState<Department[]>([]);
	const [designation, setDesignation] = useState<Designation[]>([]);
	const [position, setPosition] = useState<Position[]>([]);
	const [roles, setRoles] = useState<Role[]>([]);

	useEffect(() => {
		setLoading(true);
		const fetchData = async () => {
			try {
				const [
					departmentResponse,
					designationResponse,
					positionResponse,
					roleResponse,
				] = await Promise.all([
					request<ApiRequest<Department>>('GET', '/api/v1/ems/department'),
					request<ApiRequest<Designation>>('GET', '/api/v1/ems/designation'),
					request<ApiRequest<Position>>('GET', '/api/v1/ems/position'),
					request<ApiRequest<Role>>('GET', '/api/v1/ems/roles'),
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
				setPosition(
					Array.isArray(positionResponse.data)
						? positionResponse.data
						: [positionResponse.data],
				);
				setRoles(
					Array.isArray(roleResponse.data)
						? roleResponse.data
						: [roleResponse.data],
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

	const defaultValues = {
		employee_position_id: undefined as number | undefined,
		employee_firstname: '',
		employee_middlename: '',
		employee_lastname: '',
		employee_email: '',
		employee_profile_link: undefined as File | undefined,

		personal_information_birthday: '',
		personal_information_sex: '',
		personal_information_phone: '',
		personal_information_address_line: '',
		personal_information_postal_code: '',

		employment_information_department_id: '',
		employment_information_designation_id: '',
		employment_information_employee_type: '',
		employment_information_employee_status: '',
		employee_role_role_id: undefined as number | undefined,
	};

	const form = useForm<EmployeeFormSchema>({
		resolver: zodResolver(employeeFormSchema),
		defaultValues,
		mode: 'onChange',
	});

	const processForm = async (data: EmployeeFormSchema) => {
		try {
			const formData = new FormData();
			appendFormData(data, formData);
			console.log('FormData contents:', ...formData.entries());
			await request(
				'POST',
				`/api/v1/ems/employeeRoles?email=${data.employee_email}`,
				formData,
			);
			toast.success('Employee Added');
			navigate(-1);
		} catch (error) {
			console.log(error);
			toast.error((error as AxiosError).response?.data as string);
		}
	};

	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();

			reader.onloadend = () => {
				setSelectedImage(reader.result as string);
			};

			reader.readAsDataURL(file);
		}
	};

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
	if (res) {
		return <Card className="flex gap-5"> {res} </Card>;
	}
	if (loading) {
		return <Skeleton className="flex h-[600px]" />;
	}
	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(processForm)}
					className="w-full space-y-8"
				>
					<Card className="flex flex-col p-5 gap-5">
						<div className="flex flex-col gap-5 mb-5">
							<p className="text-lg font-semibold">Base Information</p>
							<div className="flex gap-5 px-5">
								<div className="flex-1 gap-8 md:grid md:grid-cols-3 h-full">
									<FormField
										control={form.control}
										name="employee_firstname"
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
										name="employee_middlename"
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
										name="employee_lastname"
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
									<FormField
										control={form.control}
										name="employee_email"
										render={({field}) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input
														type="text"
														disabled={loading}
														placeholder="john@example.com"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="employee_position_id"
										render={({field}) => (
											<FormItem>
												<FormLabel>Position</FormLabel>
												<Select
													disabled={loading}
													onValueChange={(value) =>
														field.onChange(Number(value))
													}
													value={field.value?.toString()}
													defaultValue={field.value?.toString()}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue
																defaultValue={field.value}
																placeholder="Select a Position"
															/>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{position.map((data, key) => (
															<SelectItem
																key={key}
																value={data.position_id?.toString() ?? ''}
															>
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
										name="employee_role_role_id"
										render={({field}) => (
											<FormItem>
												<FormLabel>Role</FormLabel>
												<Select
													disabled={loading}
													onValueChange={(value) =>
														field.onChange(Number(value))
													}
													value={field.value?.toString()}
													defaultValue={field.value?.toString()}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue
																defaultValue={field.value}
																placeholder="Select a Role"
															/>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{roles.map((data, key) => (
															<SelectItem
																key={key}
																value={data.role_id?.toString() ?? ''}
															>
																{data.name}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className="relative flex-0 flex flex-col items-center gap-5">
									<div className="overflow-hidden rounded-full w-[300px] h-[300px] border-2">
										<img
											src={
												selectedImage
													? selectedImage
													: `https://api.dicebear.com/7.x/lorelei/svg?seed=JD`
											}
											alt="Selected profile"
											className="object-cover w-full h-full"
										/>
									</div>
									<FormField
										control={form.control}
										name="employee_profile_link"
										render={({field}) => (
											<FormItem>
												<FormControl>
													<Input
														type="file"
														disabled={loading}
														onChange={(e) => {
															field.onChange(e.target.files?.[0]);
															handleFileChange(e);
														}}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
						</div>
						<div className="flex flex-col gap-5  mb-5">
							<p className="text-lg font-semibold">Personal Information</p>
							<div className="gap-8 md:grid md:grid-cols-3 px-5">
								<FormField
									control={form.control}
									name="personal_information_sex"
									render={({field}) => (
										<FormItem>
											<FormLabel>Sex</FormLabel>
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
															placeholder="Select a sex"
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
									name="personal_information_phone"
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
									name="personal_information_birthday"
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
									name="personal_information_address_line"
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
									name="personal_information_postal_code"
									render={({field}) => (
										<FormItem>
											<FormLabel>Postal code</FormLabel>
											<Input disabled={loading} placeholder="Code" {...field} />
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
						<div className="flex flex-col gap-5">
							<p className="text-lg font-semibold">Employment Information</p>
							<div className="gap-8 md:grid md:grid-cols-3 px-5">
								<FormField
									control={form.control}
									name="employment_information_department_id"
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
									name="employment_information_designation_id"
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
									name="employment_information_employee_type"
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
															placeholder="Select a Type"
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
									name="employment_information_employee_status"
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
															placeholder="Select a Status"
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
							</div>
						</div>
						<Button disabled={loading} className="ml-auto" type="submit">
							Submit
						</Button>
					</Card>
				</form>
			</Form>
		</>
	);
}
