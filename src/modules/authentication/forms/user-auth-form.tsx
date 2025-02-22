'use client';
import {PaginationResponse, request, setAuthHeader} from '@/api/axios';
import {Button} from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {zodResolver} from '@hookform/resolvers/zod';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import * as z from 'zod';
import {useEmployeeRoleDetailsStore} from '../hooks/use-sign-in-userdata';
import {EmployeeRolesWithDetails} from '@/modules/ems/_components/validation/employeeRoles';

const formSchema = z.object({
	email: z.string().email({message: 'Enter a valid email address'}),
	password: z.string().min(1, {message: 'Provide password'}),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const {setUser, user} = useEmployeeRoleDetailsStore();
	const defaultValues = {
		email: '',
		password: '',
	};
	const form = useForm<UserFormValue>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});
	useEffect(() => {
		if (user) {
			// User data has been set, navigate based on role
			switch (user.employee.position.name) {
				case 'Admin':
					navigate('admin/dashboard');
					break;
				case 'Technician':
					navigate('tech/dashboard');
					break;
				case 'Sales':
					navigate('sales/dashboard');
					break;
				default:
					navigate('/');
					break;
			}
		}
	}, [user, navigate]); // This effect will run whenever 'user' changes

	const onSubmit = async (data: UserFormValue) => {
		setLoading(true);
		try {
			const result = (await request('POST', '/auth/sign-in', data)) as {
				data: {user: {id: string}; session: {access_token: string}};
			};
			setAuthHeader(result.data.session.access_token);

			// Fetch employee data
			const employeeData = await request<
				PaginationResponse<EmployeeRolesWithDetails>
			>('GET', `/api/v1/ems/employeeRoles?user_id=${result.data.user.id}`);

			const res = employeeData.data[0];
			setUser({...res, status: 'Online'});
			await request(
				'PATCH',
				`/api/v1/ems/employeeRoles/${res.employee_roles_id}/status`,
				{status: 'Online'},
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="w-full space-y-2"
				>
					<FormField
						control={form.control}
						name="email"
						render={({field}) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										type="email"
										placeholder="Enter your email..."
										disabled={loading}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({field}) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input
										type="password"
										placeholder="Enter your pasword"
										disabled={loading}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button disabled={loading} className="ml-auto w-full" type="submit">
						Continue With Email
					</Button>
				</form>
			</Form>
			{/* <div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground">
						Or continue with
					</span>
				</div>
			</div> */}
		</>
	);
}
