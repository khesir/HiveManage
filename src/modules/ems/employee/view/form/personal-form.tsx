import {ApiRequest, request} from '@/api/axios';
import {useEmployeeStore} from '@/modules/ems/_components/hooks/use-employee-story';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {formatDate} from '@/lib/util/utils';
import {
	PersonalInformation,
	personalInformationSchema,
} from '@/modules/ems/_components/validation/employee';
import {MoreVertical} from 'lucide-react';
import {useEffect, useState} from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
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
import {toast} from 'sonner';
import {Input} from '@/components/ui/input';
import {EmployeeRolesWithDetails} from '@/modules/ems/_components/validation/employeeRoles';

interface Props {
	selectedEmployee: EmployeeRolesWithDetails;
}

export function PersonalForm({selectedEmployee}: Props) {
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
				console.log(data);
				if (data.length > 0) {
					setPersonalInfo(data[0]);
				} else {
					setPersonalInfo(undefined);
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
	const form = useForm<PersonalInformation>({
		resolver: zodResolver(personalInformationSchema),
		mode: 'onChange',
	});

	const handleEdit = () => {
		setIsEditing((prev) => !prev);
		if (personalInfo) {
			form.reset({
				birthday: formatDate(personalInfo.birthday),
				sex: personalInfo.sex as 'Male' | 'Female',
				phone: personalInfo.phone,
				email: personalInfo.email,
				address_line: personalInfo.address_line,
				postal_code: personalInfo.postal_code,
			});
		}
	};

	const [submitLoading, setSubmitLoading] = useState<boolean>(false);
	const gender = [
		{id: 1, name: 'Male'},
		{id: 2, name: 'Female'},
		{id: 3, name: 'Others'},
	];

	const processForm = async (formData: PersonalInformation) => {
		try {
			setSubmitLoading(true);
			if (!selectedEmployee) {
				throw new Error('No Employee is selected');
			}
			if (personalInfo) {
				// Update Employment Information
				await request(
					'PUT',
					`/api/v1/ems/employees/${selectedEmployee.employee.employee_id}/personalInformation/${personalInfo.personal_information_id}`,
					formData,
				);
			} else {
				// Create Employment Information
				await request(
					'POST',
					`/api/v1/ems/employees/${selectedEmployee.employee.employee_id}/personalInformation`,
					formData,
				);
			}
			// Fetch new Employment Information
			const response = await request<ApiRequest<PersonalInformation[]>>(
				'GET',
				`/api/v1/ems/employees/${selectedEmployee.employee.employee_id}/personalInformation`,
			);
			const data = response.data as PersonalInformation[];

			if (data.length > 0) {
				setPersonalInfo(data[0]);
			} else {
				setPersonalInfo(undefined);
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
				<Card className="gap-8 md:grid md:grid-cols-3 p-5">
					<FormField
						control={form.control}
						name="sex"
						render={({field}) => (
							<FormItem>
								<FormLabel>sex</FormLabel>
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
						name="email"
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
						name="phone"
						render={({field}) => (
							<FormItem>
								<FormLabel>Contact Number</FormLabel>
								<FormControl>
									<Input
										disabled={submitLoading}
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
									<Input type="date" disabled={submitLoading} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="address_line"
						render={({field}) => (
							<FormItem>
								<FormLabel>Address Line</FormLabel>
								<FormControl>
									<Input
										disabled={submitLoading}
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
								<Input disabled={submitLoading} placeholder="Code" {...field} />
								<FormMessage />
							</FormItem>
						)}
					/>
				</Card>
				<div className="flex justify-end">
					<div className="space-x-2">
						<Button type="submit">Save</Button>
						<Button type="button" variant={'destructive'} onClick={handleEdit}>
							Cancel
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
}
