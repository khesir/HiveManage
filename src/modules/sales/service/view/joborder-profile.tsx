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
export function JoborderCreateDialog({totalValue}: {totalValue: number}) {
	const [formModal, setFormModal] = useState<boolean>(false);
	const handleSubmit = () => {
		setFormModal(false);
	};
	return (
		<Dialog open={formModal} onOpenChange={setFormModal}>
			<DialogTrigger asChild>
				<Button className="flex items-center gap-1 w-full">
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
	const {data} = useJoborderStore();
	if (!data) {
		return (
			<Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
				<CardHeader className="flex flex-row items-start bg-muted/50">
					Not Found
				</CardHeader>
			</Card>
		);
	}
	const totalValue =
		data.services?.reduce(
			(total, item) => total + (item.total_cost_price ?? 0),
			0,
		) ?? 0;
	return (
		<Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
			<CardHeader className="flex flex-row items-start bg-muted/50">
				<div className="grid gap-0.5">
					<CardTitle className="group flex items-center gap-2 text-lg">
						{`#${data.joborder_uuid}`}
					</CardTitle>
					{data && (
						<CardDescription>
							Expected Completion Date:{' '}
							{dateParser(data.expected_completion_date)}
						</CardDescription>
					)}
				</div>
			</CardHeader>
			<CardContent className="p-6 text-sm">
				<div className="grid gap-3">
					<div className="font-semibold">Information</div>
					<ul className="grid gap-3">
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Status</span>
							<span>
								<Badge>{data.status}</Badge>
							</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">
								Expected Completion Date
							</span>
							<span>{dateParser(data.expected_completion_date)}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Completed At</span>
							<span>{data.completed_at ? data.completed_at : 'Not set'}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Turned Over At</span>
							<span>
								{data.turned_over_at ? data.turned_over_at : 'Not Set'}
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
							<span>{`${data.customer?.firstname} ${data.customer?.middlename} ${data.customer?.lastname}`}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Email</span>
							<span>{data.customer?.email}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Contact</span>
							<span>{data.customer?.contact_phone}</span>
						</li>
					</ul>
				</div>
				<Separator className="my-4" />
				<div className="grid gap-3">
					<div className="font-semibold">Payment Information</div>
					<ul className="grid gap-3">
						{/* <li className="flex items-center justify-between">
							<span className="text-muted-foreground">Total Costs</span>
							<span>{`${data.customer?.firstname} ${data.customer?.middlename} ${data.customer?.lastname}`}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Paid Cost</span>
							<span>{data.customer?.email}</span>
						</li> */}
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Payment Status</span>
							<span>
								<Badge>{data.payment_id ? 'Paid' : 'Unpaid'}</Badge>
							</span>
						</li>
					</ul>
				</div>
				<div className="flex mt-3">
					{data.payment_id === null && (
						<JoborderCreateDialog totalValue={totalValue} />
					)}
				</div>
			</CardContent>
		</Card>
	);
}
