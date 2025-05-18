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
import {Input} from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {zodResolver} from '@hookform/resolvers/zod';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {SearchCustomer} from '../../dashboard/customer/search-customer';
import {Customer} from '@/components/validation/customer';
import {Card} from '@/components/ui/card';
import {toast} from 'sonner';
import {useEmployeeRoleDetailsStore} from '@/modules/authentication/hooks/use-sign-in-userdata';
import {Joborder, joborderSchema} from '@/components/validation/joborder';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {useNavigate} from 'react-router-dom';
import {Expand} from 'lucide-react';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {request} from '@/api/axios';
import {AxiosError} from 'axios';

export function JoborderCreateDialog() {
	const navigate = useNavigate();
	const [formModal, setFormModal] = useState<boolean>(false);
	const handleSubmit = () => {
		setFormModal(false);
	};
	return (
		<Dialog open={formModal} onOpenChange={setFormModal}>
			<DialogTrigger asChild>
				<Button className="flex items-center gap-1">Create Joborder</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[100vh]">
				<DialogTitle className="flex gap-2 items-center">
					<Button
						size={'xs'}
						onClick={() => navigate('create')}
						variant={'outline'}
					>
						<Expand className="w-3 h-3" />
					</Button>
					Joborder Form
				</DialogTitle>
				<DialogDescription></DialogDescription>
				<CreateJoborderForm onSubmit={handleSubmit} isDialog={true} />
			</DialogContent>
		</Dialog>
	);
}
type Props = {
	onSubmit?: () => void;
	isDialog?: boolean;
};
export function CreateJoborderForm({onSubmit, isDialog = false}: Props) {
	const [loading, setLoading] = useState<boolean>(false);
	const [customer, setCustomer] = useState<Customer>();
	const {user} = useEmployeeRoleDetailsStore();

	const form = useForm<Joborder>({
		resolver: zodResolver(joborderSchema),
		mode: 'onSubmit',
	});

	const processForm = async (formData: Joborder) => {
		setLoading(true);
		if (!customer) {
			toast.error('Please select a customer');
			setLoading(false);
			return;
		}
		if (!user?.employee.employee_id) {
			toast.error('User is null. Cannot proceed with creating service.');
			setLoading(false);
			return;
		}
		try {
			const data: Joborder = {
				...formData,
				customer_id: customer.customer_id,
				user_id: user?.employee.employee_id,
			};
			await request('POST', `/api/v1/sms/joborder`, data);
			setLoading(false);
			if (onSubmit) {
				onSubmit();
			}
		} catch (e) {
			if (e instanceof Error) {
				toast.error(e.toString());
			} else if (e instanceof AxiosError) {
				toast.error(e.response?.data as string);
			} else {
				toast.error('An unknown error occured');
			}
			console.log(e);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center h-full items-center">loading..</div>
		);
	}
	const status = [
		'Pending',
		'In Progress',
		'Completed',
		'Turned Over',
		'Cancelled',
	];

	return (
		<div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(processForm)}
					className="space-y-4 flex flex-col"
				>
					<div className="space-y-3">
						<FormField
							control={form.control}
							name="status"
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
							name="expected_completion_date"
							render={({field}) => (
								<FormItem>
									<FormLabel>Expected Completion Date</FormLabel>
									<FormControl>
										<Input
											type="date"
											disabled={loading}
											placeholder="John"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										This can be updated in later process
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					{isDialog ? (
						<div className="flex flex-col gap-5">
							<Popover>
								<PopoverTrigger asChild>
									<div className="flex flex-col gap-5 cursor-pointer">
										{Object.keys(customer ?? {}).length === 0 ? (
											<Card className="w-full p-3 flex flex-col gap-5">
												<div>
													<h3 className="text-sm font-semibold">
														No Customer Selected
													</h3>
													<p className="text-xs">
														Please select or create a customer to proceed.
													</p>
												</div>
											</Card>
										) : (
											<Card className="w-full p-3 flex flex-col gap-5">
												<div>
													<h3 className="text-sm font-semibold">
														{`#${customer?.customer_id} ${customer?.firstname} ${customer?.middlename} ${customer?.lastname}`}
													</h3>
													<p className="text-xs">
														Please select or create a customer to proceed.
													</p>
												</div>
											</Card>
										)}
									</div>
								</PopoverTrigger>
								<PopoverContent align="start" className="w-[60vh]">
									<SearchCustomer
										processCreate={setCustomer}
										showTitle={false}
										showConfirmation={false}
									/>
								</PopoverContent>
							</Popover>
							<Button>Submit</Button>
						</div>
					) : (
						<div className="flex flex-col gap-5">
							<div className="flex flex-col gap-5 cursor-pointer">
								{Object.keys(customer ?? {}).length === 0 ? (
									<Card className="w-full p-3 flex flex-col gap-5">
										<div>
											<h3 className="text-sm font-semibold">
												No Customer Selected
											</h3>
											<p className="text-xs">
												Please select or create a customer to proceed.
											</p>
										</div>
									</Card>
								) : (
									<Card className="w-full p-3 flex flex-col gap-5">
										<div>
											<h3 className="text-sm font-semibold">
												{`#${customer?.customer_id} ${customer?.firstname} ${customer?.middlename} ${customer?.lastname}`}
											</h3>
											<p className="text-xs">
												Please select or create a customer to proceed.
											</p>
										</div>
									</Card>
								)}
							</div>
							<SearchCustomer processCreate={setCustomer} showTitle={false} />
							<Button>Submit</Button>
						</div>
					)}
				</form>
			</Form>
		</div>
	);
}
