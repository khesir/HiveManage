import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';

import {
	EmployeeBasicInformation,
	employeeSchema,
} from '@/modules/ems/_components/validation/employee';
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

import {toast} from 'sonner';
import {Input} from '@/components/ui/input';
import {PaginationResponse, request} from '@/api/axios';
import {EmployeeRolesWithDetails} from '@/modules/ems/_components/validation/employeeRoles';
import {useState} from 'react';

interface Props {
	selectedEmployee: EmployeeRolesWithDetails;
}

export function EmployeeForm({selectedEmployee}: Props) {
	const [loading, setLoading] = useState<boolean>(false);

	const form = useForm<EmployeeBasicInformation>({
		resolver: zodResolver(employeeSchema),
		mode: 'onChange',
	});

	const handleEdit = () => {
		setIsEditing((prev) => !prev);
		if (selectedEmployee) {
			form.reset({
				firstname: selectedEmployee.employee.firstname,
				middlename: selectedEmployee.employee.middlename,
				lastname: selectedEmployee.employee.lastname,
			});
		}
	};

	const processForm = async (formData: EmployeeBasicInformation) => {
		try {
			setLoading(true);
			await request(
				'PUT',
				`/api/v1/ems/employees/${selectedEmployee?.employee.employee_id}`,
				formData,
			);
			const empRoleData = await request<
				PaginationResponse<EmployeeRolesWithDetails>
			>(
				'GET',
				`/api/v1/ems/employee-roles?employee_id=${selectedEmployee?.employee.employee_id}`,
			);
			setSelectedEmployee(empRoleData.data[0]);
		} catch (error) {
			toast('Error updating employment information:', {
				description:
					error instanceof Error ? error.message : 'An unknown error occurred',
			});
		} finally {
			handleEdit();
			setLoading(false);
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
						name="firstname"
						render={({field}) => (
							<FormItem>
								<FormLabel>First Name</FormLabel>
								<FormControl>
									<Input disabled={loading} placeholder="John" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="middlename"
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
						name="lastname"
						render={({field}) => (
							<FormItem>
								<FormLabel>Last Name</FormLabel>
								<FormControl>
									<Input disabled={loading} placeholder="Doe" {...field} />
								</FormControl>
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
