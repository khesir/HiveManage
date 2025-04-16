import {ApiRequest, request} from '@/api/axios';
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
import {Textarea} from '@/components/ui/textarea';
import {zodResolver} from '@hookform/resolvers/zod';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {Card} from '@/components/ui/card';
import {toast} from 'sonner';
import {useEmployeeRoleDetailsStore} from '@/modules/authentication/hooks/use-sign-in-userdata';
import {useNavigate, useParams} from 'react-router-dom';
import {TicketType} from '@/components/validation/ticket-type';
import {Ticket, ticketSchema} from '@/components/validation/tickets';
import {SearchEmployee} from '../_components/employee-selector';
import useEmployeeStore from '../_components/use-employee-list-hook';
import {AvatarCircles} from '@/components/ui/avatarcircles';
import {Button} from '@/components/ui/button';
import {CreateTicket} from '@/api/tickets-api';

export function TicketForm() {
	const [loading, setLoading] = useState<boolean>(false);
	const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
	const {user} = useEmployeeRoleDetailsStore();
	const {id} = useParams();
	const navigate = useNavigate();
	const {selectedEmployees, removeEmployeeById} = useEmployeeStore();
	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await request<ApiRequest<TicketType>>(
					'GET',
					'/api/v1/sms/ticket-type',
				);

				setTicketTypes(Array.isArray(res.data) ? res.data : [res.data]);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);
	const form = useForm<Ticket>({
		resolver: zodResolver(ticketSchema),
		defaultValues: {
			user_id: user?.employee.employee_id,
			service_id: Number(id),
		},
		mode: 'onSubmit',
	});

	const processForm = async (formData: Ticket) => {
		setLoading(true);
		if (!id) {
			toast.error('Cant find service id, kindly refresh the page');
			setLoading(false);
			return;
		}
		if (!formData.user_id) {
			toast.error('User is null. Cannot proceed with creating service.');
			setLoading(false);
			return;
		}
		if (selectedEmployees.length <= 0) {
			toast.error('At least put 1 employee to be responsible for this ticket');
			setLoading(false);
			return;
		}
		await CreateTicket(formData, selectedEmployees, id);
		setLoading(false);
		navigate(-1);
	};

	if (loading) {
		return (
			<div className="flex justify-center h-full items-center">loading..</div>
		);
	}
	const status = [
		'Pending',
		'In Review',
		'Approved',
		'Rejected',
		'Assigned',
		'In Progress',
		'On Hold',
		'Completed',
		'Cancelled',
		'Closed',
	];

	const avatar = (selectedEmployees ?? []).map((row) => ({
		name: `${row.employee.firstname} ${row.employee.lastname}`,
		link:
			typeof row.employee?.profile_link === 'string'
				? row.employee.profile_link
				: '',
		id: row.employee.employee_id,
	}));
	return (
		<div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(processForm)}
					className="space-y-4 flex flex-col md:flex-row gap-5"
				>
					<div className="flex-[50%] space-y-3">
						<FormField
							control={form.control}
							name="title"
							render={({field}) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input
											{...field}
											disabled={loading}
											placeholder="Ticket Title"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex gap-3 justify-between">
							<FormField
								control={form.control}
								name="ticket_status"
								render={({field}) => (
									<FormItem>
										<FormLabel>Status</FormLabel>
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
												{status.map((data, index) => (
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
							<FormField
								control={form.control}
								name="ticket_type_id"
								render={({field}) => (
									<FormItem>
										<FormLabel>Ticket Type</FormLabel>
										<Select
											disabled={loading}
											onValueChange={(value) => field.onChange(Number(value))}
											value={field.value?.toString()}
											defaultValue={field.value?.toString()}
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
												{ticketTypes.map((type) => (
													<SelectItem
														key={type.ticket_type_id}
														value={type.ticket_type_id?.toString() ?? ''}
													>
														{type.name}
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
								name="deadline"
								render={({field}) => (
									<FormItem>
										<FormLabel>Deadline</FormLabel>
										<FormControl>
											<Input
												type="date"
												disabled={loading}
												placeholder="John"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="description"
							render={({field}) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Input
											{...field}
											disabled={loading}
											placeholder="Short Description"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="content"
							render={({field}) => (
								<FormItem>
									<FormLabel>Content</FormLabel>
									<FormControl>
										<Textarea
											className="md:h-[30vh]"
											{...field}
											disabled={loading}
											placeholder="What is this ticket about?"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit">Submit</Button>
					</div>
					<div className="flex-[50%] flex flex-col gap-5">
						{selectedEmployees.length === 0 ? (
							<Card className="w-full p-5 flex flex-col gap-5">
								<div>
									<h3 className="text-lg font-semibold">
										No Employee Selected
									</h3>
									<p>Please select a employee to proceed.</p>
								</div>
							</Card>
						) : (
							<Card className="w-full p-5 flex flex-col gap-5">
								<p>Selected Employees</p>
								<AvatarCircles
									avatar={avatar}
									className="relative gap-5"
									tabs={true}
									callback={removeEmployeeById}
								/>
							</Card>
						)}
						<pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>
						<SearchEmployee />
					</div>
				</form>
			</Form>
		</div>
	);
}
