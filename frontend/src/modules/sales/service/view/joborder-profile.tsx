import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {dateParser} from '@/lib/util/utils';
import {Separator} from '@/components/ui/separator';
import useJoborderStore from '../_components/use-joborder-hook';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {useState} from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {Payment} from '@/components/validation/payment';
import {toast} from 'sonner';
import {useEmployeeRoleDetailsStore} from '@/modules/authentication/hooks/use-sign-in-userdata';
import {CreatePaymentForm} from '../../sales/create/payment-form';
import {request} from '@/api/axios';
import {useParams} from 'react-router-dom';
import {AxiosError} from 'axios';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {ArrowBigRightDash} from 'lucide-react';
import {Joborder} from '@/components/validation/joborder';
import useEventTrigger from '../_components/use-event-hook';
export function JoborderCreateDialog({
	totalValue,
	loading,
}: {
	totalValue: number;
	loading: boolean;
}) {
	const [formModal, setFormModal] = useState<boolean>(false);
	const handleSubmit = () => {
		setFormModal(false);
	};
	return (
		<Dialog open={formModal} onOpenChange={setFormModal}>
			<DialogTrigger asChild>
				<Button className="flex items-center gap-1 w-full" disabled={loading}>
					Submit Payment
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[100vh]">
				<DialogTitle className="flex gap-2 items-center"></DialogTitle>
				<DialogDescription></DialogDescription>
				<PaymentForm onSubmit={handleSubmit} totalValue={totalValue} />
			</DialogContent>
		</Dialog>
	);
}
type Props = {
	onSubmit: () => void;
	totalValue: number;
};
export function PaymentForm({onSubmit, totalValue}: Props) {
	const [loading, setLoading] = useState(false);
	const {joborder_id} = useParams();
	const {user} = useEmployeeRoleDetailsStore();
	const {toggleTrigger} = useEventTrigger();
	const processData = async (payment: Payment) => {
		setLoading(true);
		if (!user) {
			toast.error('User is null. Cannot proceed with creating sales.');
			setLoading(false);
			return;
		}
		try {
			await request('POST', `/api/v1/sms/joborder/${joborder_id}/payment`, {
				payment: payment,
				user_id: user.employee.employee_id,
			});
			toggleTrigger();
			toast.success('Payment has successfully been processed');
		} catch (e) {
			if (e instanceof Error) {
				toast.error(e.toString());
			} else if (e instanceof AxiosError) {
				toast.error(e.response?.data as string);
			} else {
				toast.error('An unknown error occured');
			}
			console.log(e);
		}
		onSubmit();
	};
	return (
		<CreatePaymentForm
			loading={loading}
			process={processData}
			totalValue={totalValue}
		/>
	);
}
export function JoborderProfile() {
	const {joborderData} = useJoborderStore();
	const {user} = useEmployeeRoleDetailsStore();
	const [loading, setLoading] = useState(false);
	const {toggleTrigger} = useEventTrigger();
	if (!joborderData) {
		return (
			<Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
				<CardHeader className="flex flex-row items-start bg-muted/50">
					Not Found
				</CardHeader>
			</Card>
		);
	}
	const totalValue =
		joborderData.services?.reduce(
			(total, item) => total + (item.total_cost_price ?? 0),
			0,
		) ?? 0;
	const updateStatus = async (
		status:
			| 'In Progress'
			| 'Completed'
			| 'Turned Over'
			| 'Cancelled'
			| 'Pending',
	) => {
		try {
			const data: Joborder = {
				...joborderData,
				status: status,
				completed_at: status === 'Completed' ? new Date().toISOString() : '',
				user_id: user?.employee.employee_id,
			};
			await request(
				'PUT',
				`/api/v1/sms/joborder/${joborderData.joborder_id}`,
				data,
			);
			setLoading(false);
			toast.success('Status Updated Successfully');
			toggleTrigger();
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
	return (
		<Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
			<CardHeader className="flex flex-row items-start bg-muted/50">
				<div className="grid gap-0.5">
					<CardTitle className="group flex items-center gap-2 text-lg">
						{`#${joborderData.joborder_uuid}`}
					</CardTitle>
					{joborderData && (
						<CardDescription>
							Created at: {dateParser(joborderData.created_at ?? '', true)}
						</CardDescription>
					)}
				</div>
				<div className="relative ml-auto flex items-center flex-col">
					<Popover>
						<PopoverTrigger>
							<Button
								size="sm"
								variant="outline"
								className="h-8 gap-1 rounded-b w-[120px]"
							>
								{joborderData.status}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="p-1 flex flex-col gap-2 items-start w-28">
							{/* <span className="text-sm flex items-center gap-1 cursor-pointer hover:bg-secondary w-full rounded-sm p-1">
								<Cog className="h-5 w-5" />
								Update
							</span> */}

							{joborderData.status === 'Pending' && (
								<span
									onClick={() => updateStatus('In Progress')}
									className="text-sm flex items-center gap-1 cursor-pointer  hover:bg-secondary w-full rounded-sm p-1"
								>
									<ArrowBigRightDash className="h-5 w-5" />
									Set Inprogress
								</span>
							)}
							{joborderData.status === 'In Progress' && (
								<span
									onClick={() => updateStatus('Completed')}
									className="text-sm flex items-center gap-1 cursor-pointer hover:bg-secondary w-full rounded-sm p-1"
								>
									<ArrowBigRightDash className="h-5 w-5" />
									Set Complete
								</span>
							)}
							{joborderData.status === 'Completed' && (
								<span
									onClick={() => updateStatus('In Progress')}
									className="text-sm flex items-center gap-1 cursor-pointer  hover:bg-secondary w-full rounded-sm p-1"
								>
									<ArrowBigRightDash className="h-5 w-5" />
									Set Inprogress
								</span>
							)}
						</PopoverContent>
					</Popover>
				</div>
			</CardHeader>
			<CardContent className="p-6 text-sm">
				<div className="grid gap-3">
					<div className="font-semibold">Information</div>
					<ul className="grid gap-3">
						{/* <li className="flex items-center justify-between">
							<span className="text-muted-foreground">Status</span>
							<span>
								<Badge>{joborderData.status}</Badge>
							</span>
						</li> */}
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">
								Expected Completion Date
							</span>
							<span>{dateParser(joborderData.expected_completion_date)}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Completed At</span>
							<span>
								{joborderData.completed_at
									? dateParser(joborderData.completed_at, true)
									: 'Not set'}
							</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Turned Over At</span>
							<span>
								{joborderData.turned_over_at
									? dateParser(joborderData.turned_over_at, true)
									: 'Not Set'}
							</span>
						</li>
					</ul>
				</div>
				<Separator className="my-4" />
				<div className="grid gap-3">
					<div className="font-semibold">Customer Information</div>
					<ul className="grid gap-3">
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Name</span>
							<span>{`${joborderData.customer?.firstname} ${joborderData.customer?.middlename} ${joborderData.customer?.lastname}`}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Email</span>
							<span>{joborderData.customer?.email}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Contact</span>
							<span>{joborderData.customer?.contact_phone}</span>
						</li>
					</ul>
				</div>
				<Separator className="my-4" />
				<div className="grid gap-3">
					<div className="font-semibold">Payment Information</div>
					<ul className="grid gap-3">
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Overall Cost</span>
							<span>{totalValue}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Payment Status</span>
							<span>
								<Badge>{joborderData.payment_id ? 'Paid' : 'Unpaid'}</Badge>
							</span>
						</li>
					</ul>
				</div>
				<div className="flex mt-3">
					{joborderData.payment_id === null && (
						<JoborderCreateDialog totalValue={totalValue} loading={loading} />
					)}
				</div>
			</CardContent>
		</Card>
	);
}
