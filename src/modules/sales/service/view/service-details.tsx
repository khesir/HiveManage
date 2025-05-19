import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {dateParser} from '@/lib/util/utils';
import {AvatarCircles} from '@/components/ui/avatarcircles';
import {Separator} from '@/components/ui/separator';
import useService from '../../_components/hooks/use-service';
import {ReplacementDetailsCard} from './serviceDetails/replacement/replacementDetails';
import {RepairDetailsCard} from './serviceDetails/repair/repairDetails';
import {CleaningDetailsCard} from './serviceDetails/cleaning/cleaningDetails';
import {BuildDetailsCard} from './serviceDetails/build/buildDetails';
import {UpgradeDetailsCard} from './serviceDetails/upgrade/upgradeDetails';
import {RentDetailsCard} from './serviceDetails/rent/rentDetails';
import {Popover} from '@/components/ui/popover';
import useEventTrigger from '../_components/use-event-hook';
import {Service} from '@/components/validation/service';
import {useEmployeeRoleDetailsStore} from '@/modules/authentication/hooks/use-sign-in-userdata';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {PopoverTrigger, PopoverContent} from '@/components/ui/popover';
import {ArrowBigRightDash} from 'lucide-react';
import {useState} from 'react';
import axios from 'axios';

export function ServiceInformation() {
	const {data} = useService();
	const {toggleTrigger} = useEventTrigger();
	const {user} = useEmployeeRoleDetailsStore();
	const [loading, setLoading] = useState(false);

	// Assuming joborderData is the same as data, or adjust as needed
	const joborderData = data;

	if (!data) {
		return (
			<Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
				<CardHeader className="flex flex-row items-start bg-muted/50">
					Not Found
				</CardHeader>
			</Card>
		);
	}
	const updateStatus = async (
		status: 'In Progress' | 'Completed' | 'Pending',
	) => {
		if (!user) {
			toast.error('User not found');
			return;
		}
		try {
			setLoading(true);
			const serviceData: Service = {
				...data,
				service_status: status,
				user_id: user.employee.employee_id!,
			};
			await axios.put(
				`/api/v1/sms/joborder/${data.joborder_id}/service/${data.service_id}`,
				serviceData,
			);
			toast.success('Status Updated Successfully');
			toggleTrigger();
		} catch (e) {
			if (e instanceof Error) {
				toast.error(e.toString());
			} else if (axios.isAxiosError(e)) {
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
						{`Service ID #${data.uuid}`}
					</CardTitle>
					{data && (
						<CardDescription>
							Joined date: {dateParser(data.created_at ?? '')}
						</CardDescription>
					)}
				</div>
			</CardHeader>
			<CardContent className="p-6 text-sm">
				<div className="grid gap-3">
					<div className="font-semibold flex items-center justify-between">
						<span>Information</span>
						<div className="relative ml-auto flex items-center flex-col">
							<Popover>
								<PopoverTrigger>
									<Button
										size="xs"
										variant="outline"
										className="gap-1 rounded-b w-[120px]"
										disabled={loading}
									>
										{data.service_status}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="p-1 flex flex-col gap-2 items-start w-28">
									{data.service_status === 'Pending' && (
										<span
											onClick={() => updateStatus('In Progress')}
											className="text-sm flex items-center gap-1 cursor-pointer hover:bg-secondary w-full rounded-sm p-1"
										>
											<ArrowBigRightDash className="h-5 w-5" />
											Set In Progress
										</span>
									)}
									{joborderData?.service_status === 'In Progress' && (
										<span
											onClick={() => updateStatus('Completed')}
											className="text-sm flex items-center gap-1 cursor-pointer hover:bg-secondary w-full rounded-sm p-1"
										>
											<ArrowBigRightDash className="h-5 w-5" />
											Set Complete
										</span>
									)}
									{joborderData?.service_status === 'Completed' && (
										<span
											onClick={() => updateStatus('In Progress')}
											className="text-sm flex items-center gap-1 cursor-pointer hover:bg-secondary w-full rounded-sm p-1"
										>
											<ArrowBigRightDash className="h-5 w-5" />
											Set In Progress
										</span>
									)}
								</PopoverContent>
							</Popover>
						</div>
					</div>
					<ul className="mt-4 space-y-2">
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Handled By</span>
							<span>
								<AvatarCircles
									avatar={(data.assigned ?? []).map((leader) => ({
										link:
											leader.employee?.profile_link ??
											'/public/default-avatar.png',
										name: `${leader.employee?.firstname} ${leader.employee?.middlename} ${leader.employee?.lastname}`,
									}))}
								/>
							</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Total Cost</span>
							<span>{data.total_cost_price}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Status</span>
							<span>{data.service_status}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Type</span>
							<span>{data.service_type?.name}</span>
						</li>
					</ul>
				</div>
				<Separator className="my-4" />
				{data.service_type?.name === 'Repair' ? (
					<RepairDetailsCard />
				) : data.service_type?.name === 'Cleaning' ? (
					<CleaningDetailsCard />
				) : data.service_type?.name === 'Replacement' ? (
					<ReplacementDetailsCard />
				) : data.service_type?.name === 'Build' ? (
					<BuildDetailsCard />
				) : data.service_type?.name === 'Upgrade' ? (
					<UpgradeDetailsCard />
				) : data.service_type?.name === 'Rent' ? (
					<RentDetailsCard />
				) : (
					<CardContent>
						<p>No selected Service</p>
					</CardContent>
				)}
			</CardContent>
		</Card>
	);
}
