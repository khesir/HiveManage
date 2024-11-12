import {ApiRequest, request} from '@/api/axios';
import {Button} from '@/components/ui/button';
import {formatDate} from '@/lib/util/utils';
import {
	PersonalInformation,
	personalInformationSchema,
} from '@/modules/ems/_components/validation/employee';
import {useEffect, useState} from 'react';
import {
	Form,
	FormControl,
	FormDescription,
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
import {toast} from 'sonner';
import {Input} from '@/components/ui/input';
import {EmployeeRolesWithDetails} from '@/modules/ems/_components/validation/employeeRoles';
import {Separator} from '@/components/ui/separator';
import {
	CreatePersonal,
	UpdatePersonal,
} from '@/modules/ems/_components/api/employee';

interface Props {
	selectedEmployee: EmployeeRolesWithDetails;
	onSubmit?: () => void;
}

export function PersonalForm({selectedEmployee, onSubmit}: Props) {
	const [loading, setLoading] = useState<boolean>(false);
	const [personalInfo, setPersonalInfo] = useState<PersonalInformation>();

	useEffect(() => {
		if (!selectedEmployee || !selectedEmployee.employee.employee_id) return; // Guard clause

		const fetchEmploymentData = async () => {
			setLoading(true);
			try {
				const response = await request<ApiRequest<PersonalInformation[]>>(
					'GET',
					`api/v1/ems/employees/${selectedEmployee.employee.employee_id}/personalInformation`,
				);
				const data = response.data as PersonalInformation[];
				setPersonalInfo(data.length > 0 ? data[0] : undefined);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};
		if (selectedEmployee.employee.employee_id) {
			fetchEmploymentData();
		}
	}, [selectedEmployee.employee.employee_id]); // Only depend on selectedEmployee

	// Form
	const form = useForm<PersonalInformation>({
		resolver: zodResolver(personalInformationSchema),
		mode: 'onChange',
	});

	useEffect(() => {
		if (personalInfo) {
			form.reset({
				birthday: formatDate(personalInfo.birthday),
				sex: personalInfo.sex as 'Male' | 'Female',
				phone: personalInfo.phone,
				address_line: personalInfo.address_line,
				postal_code: personalInfo.postal_code,
			});
		}
	}, [personalInfo, form]);
	const gender = [
		{id: 1, name: 'Male'},
		{id: 2, name: 'Female'},
	];

	const processForm = async (formData: PersonalInformation) => {
		try {
			setLoading(true);
			if (!selectedEmployee) {
				throw new Error('No Employee is selected');
			}
			if (personalInfo) {
				const response = await UpdatePersonal(
					formData,
					selectedEmployee.employee.employee_id,
					personalInfo!.personal_information_id!,
				);
				setPersonalInfo(response);
			} else {
				const response = await CreatePersonal(
					formData,
					selectedEmployee.employee.employee_id,
				);
				setPersonalInfo(response);
			}
			toast.success('Personal Information Successfully Added');
			if (onSubmit) {
				onSubmit();
			}
		} catch (error) {
			toast('Error updating employment information:', {
				description:
					error instanceof Error ? error.message : 'An unknown error occurred',
			});
		} finally {
			setLoading(false);
		}
	};
	if (loading) {
		return (
			<div className="flex justify-center h-full items-center">loading..</div>
		);
	}
	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Personal Information</h3>
				<p className="text-sm text-muted-foreground">
					This is where you can set personal necessary informations
				</p>
			</div>
			<Separator />
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(processForm)}
					className="w-full space-y-8"
				>
					<FormField
						control={form.control}
						name="sex"
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
												placeholder="Select a Sex"
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
								<FormDescription>
									Please select biological sex as assigned at birth.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="phone"
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
						name="birthday"
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
					<div className="grid grid-cols-2 gap-5">
						<FormField
							control={form.control}
							name="address_line"
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
							name="postal_code"
							render={({field}) => (
								<FormItem>
									<FormLabel>Postal code</FormLabel>
									<Input disabled={loading} placeholder="Code" {...field} />
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
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
