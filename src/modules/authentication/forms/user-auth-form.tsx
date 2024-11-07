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
import {EmployeeRolesWithDetails} from '@/lib/employee-custom-form-schema';
import {zodResolver} from '@hookform/resolvers/zod';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import * as z from 'zod';
import {useEmployeeRoleDetailsStore} from '../hooks/use-sign-in-userdata';

const formSchema = z.object({
	email: z.string().email({message: 'Enter a valid email address'}),
	password: z.string().min(1, {message: 'Provide password'}),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
	const [loading] = useState(false);
	const navigate = useNavigate();
	const defaultValues = {
		email: '',
		password: '',
	};
	const form = useForm<UserFormValue>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const onSubmit = async (data: UserFormValue) => {
		const result = (await request('POST', '/auth/sign-in', data)) as {
			data: {user: {id: string}; session: {access_token: string}};
		};
		setAuthHeader(result.data.session.access_token);
		const empData = await request<PaginationResponse<EmployeeRolesWithDetails>>(
			'GET',
			`/api/v1/ems/employee-roles?user_id=${result.data.user.id}`,
		);
		useEmployeeRoleDetailsStore.getState().setUser(empData.data[0]);

		if (window.history.state && window.history.state.idx > 0) {
			navigate(-1);
		} else {
			navigate('/dashboard');
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
