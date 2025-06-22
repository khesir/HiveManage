import {ApiRequest, request} from '@/api/axios';
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {Textarea} from '@/components/ui/textarea';
import {Service, serviceSchema} from '@/components/validation/service';
import {ServiceType} from '@/components/validation/service-type';
import {zodResolver} from '@hookform/resolvers/zod';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {SearchCustomer} from '../../dashboard/customer/search-customer';
import {Customer} from '@/components/validation/customer';
import {Card} from '@/components/ui/card';
import {SalesCustomerProfile} from '../../sales/create/customer-profile-form';
import {generateCustomUUID} from '@/lib/util/utils';
import {toast} from 'sonner';
import {useEmployeeRoleDetailsStore} from '@/modules/authentication/hooks/use-sign-in-userdata';
import {useNavigate} from 'react-router-dom';

export function ServiceForm() {
	const [loading, setLoading] = useState<boolean>(false);
	const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
	const [customer, setCustomer] = useState<Customer>();
	const {user} = useEmployeeRoleDetailsStore();
	const navigate = useNavigate();
	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await request<ApiRequest<ServiceType>>(
					'GET',
					'/api/v1/sms/service-type',
				);

				setServiceTypes(Array.isArray(res.data) ? res.data : [res.data]);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);
	const form = useForm<Service>({
		resolver: zodResolver(serviceSchema),
		defaultValues: {
			uuid: generateCustomUUID(),
			user_id: user?.employee.employee_id,
		},
		mode: 'onSubmit',
	});

	const processForm = async (formData: Service) => {
		setLoading(true);
		if (!customer) {
			toast.error('Please select a customer');
			return;
		}
		if (!formData.user_id) {
			toast.error('User is null. Cannot proceed with creating service.');
			setLoading(false);
			return;
		}
		const data: Service = {
			...formData,
			customer_id: customer.customer_id,
			total_cost_price: formData.fee,
		};
		console.log(data);
		setLoading(false);
		navigate(-1);
	};

	if (loading) {
		return (
			<div className="flex justify-center h-full items-center">loading..</div>
		);
	}
	const status = ['Cancelled', 'Pending', 'In Progress', 'Complete'];

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
							name="uuid"
							render={({field}) => (
								<FormItem>
									<FormLabel>UUID</FormLabel>
									<FormControl>
										<Input {...field} disabled={true} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="service_type_id"
							render={({field}) => (
								<FormItem>
									<FormLabel>Service Type</FormLabel>
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
											{serviceTypes.map((service) => (
												<SelectItem
													key={service.service_type_id}
													value={service.service_type_id?.toString() ?? ''}
												>
													{service.name}
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
							name="fee"
							render={({field}) => (
								<FormItem>
									<FormLabel>Tentative Fee</FormLabel>
									<FormControl>
										<Input
											type="number"
											{...field}
											disabled={loading}
											placeholder="Enter a fee"
											onChange={(e) => {
												const value = e.target.value;
												// Ensure the value is converted to a number
												field.onChange(value ? parseFloat(value) : 0);
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="service_status"
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
							name="description"
							render={({field}) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											className="md:h-[30vh]"
											{...field}
											disabled={loading}
											placeholder="What is it?"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="flex-[50%] flex flex-col gap-5">
						<SearchCustomer processCreate={setCustomer} showTitle={false} />

						{Object.keys(customer ?? {}).length === 0 ? (
							<Card className="w-full p-5 flex flex-col gap-5">
								<div>
									<h3 className="text-lg font-semibold">
										No Customer Selected
									</h3>
									<p>Please select or create a customer to proceed.</p>
								</div>
							</Card>
						) : (
							<SalesCustomerProfile
								data={customer!}
								onClick={() => setCustomer({} as Customer)}
							>
								<Button className="w-full bg-green-400">Create Service</Button>
							</SalesCustomerProfile>
						)}
					</div>
				</form>
			</Form>
		</div>
	);
}
