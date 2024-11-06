import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import {dateParser} from '@/lib/util/utils';
import {useJoborderStore} from '../../_components/hooks/use-joborder-store.ts';
import {Separator} from '@/components/ui/separator';
import {Button} from '@/components/ui/button';
import {Ticket} from 'lucide-react';
import {ViewJoborderTasks} from '../../service/joborder/view/view-joborder-tabs';
import {ViewJoborderProfileTabs} from '../../service/joborder/view/view-joborder-profile-tabs';
import {EmployeeCardCount} from '../../service/joborder/view/employee-card-count';
import {TaskAdd} from '../../service/joborder/view/form/taskAdd';
import useAddFormStatus from '../../_components/hooks/use-ticket-form';
import {useEffect, useState} from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {ApiRequest, request} from '@/api/axios';
import {EmployeeBasicInformation} from '@/lib/employee-zod-schema';
import {AssignEmployeeWithDetails} from '@/lib/sales-zod-schema';
import {CreateReport} from '../../service/joborder/view/form/create-report';
import {AssignEmployeeModal} from '../../_components/modal/assign-employee-modal.tsx';

export default function JoborderView() {
	const {joborderData} = useJoborderStore();
	const {addStatus, setAddStatus} = useAddFormStatus();
	const [employee, setEmployee] = useState<EmployeeBasicInformation[]>([]);
	const [assignEmployee, setAssignEmployees] = useState<
		AssignEmployeeWithDetails[]
	>([]);
	useEffect(() => {
		const fetchData = async () => {
			const res = await request<ApiRequest<AssignEmployeeWithDetails[]>>(
				'GET',
				`/api/v1/sms/service/${joborderData?.service.service_id}/joborder/${joborderData?.joborder_id}/assigned-employee`,
			);
			const filteredData: EmployeeBasicInformation[] = (
				res.data as AssignEmployeeWithDetails[]
			).map((emp) => emp.employee);
			setEmployee(filteredData);
			setAssignEmployees(res.data as AssignEmployeeWithDetails[]);
		};
		fetchData();
		setAddStatus('main');
	}, [joborderData]);
	// Modal Controls
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isReportModalOpen, setIsReportModalOpen] = useState(false);
	return (
		<div className="flex flex-col sm:gap-4">
			<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
				{/* Employee List */}
				<div className="grid items-start auto-rows-max gap-4 gap md:gap-6 lg:col-span-2">
					{addStatus === 'main' ? (
						<>
							<div className="flex flex-col gap-4">
								<div className="flex justify-between gap-3">
									<Card
										className="w-[60%] h-[180px]"
										x-chunk="dashboard-05-chunk-1"
									>
										<CardHeader className="pb-3">
											<CardTitle>Joborder</CardTitle>
											<div className="flex flex-col gap-3">
												<CardDescription className="max-w-lg text-balance leading-relaxed">
													Introducing Our Dynamic Orders Dashboard for Seamless
													Management and Insightful Analysis.
												</CardDescription>
												<div className="flex items-center gap-2">
													<Button
														className="h-8"
														onClick={() => setIsReportModalOpen(true)}
													>
														Report Complete
													</Button>
													<Button
														className="h-8"
														variant={'destructive'}
														disabled={true}
														onClick={() => setIsModalOpen(true)}
													>
														Close Joborder
													</Button>
												</div>
											</div>
										</CardHeader>
									</Card>
									<EmployeeCardCount employee={employee}>
										<AssignEmployeeModal
											assignEmployee={assignEmployee}
											joborder_id={joborderData?.joborder_id ?? null}
											prevEmployees={employee}
											isService={false}
										/>
									</EmployeeCardCount>
								</div>
							</div>
							<ViewJoborderTasks />
						</>
					) : addStatus === 'add' ? (
						<TaskAdd />
					) : addStatus === 'reports' ? (
						<CreateReport data={joborderData} />
					) : (
						<>Soimething</>
					)}
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex lg:hidden">
						<Separator />
					</div>
					<Card>
						<CardHeader className="flex flex-col items-start bg-muted/50">
							<div className="grid gap-0.5">
								<CardTitle className="group flex items-center gap-2 text-lg">
									{`#${joborderData?.joborder_id} ${joborderData?.uuid}`}
								</CardTitle>
								<CardDescription>
									Created date: {dateParser(joborderData?.created_at ?? '')}
								</CardDescription>
							</div>
							<div className="flex items-center gap-1">
								<Button
									size="sm"
									variant="default"
									className="h-8 gap-1"
									onClick={() => setAddStatus('reports')}
								>
									<Ticket className="h-3.5 w-3.5" />
									<span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
										Create Reports
									</span>
								</Button>
							</div>
						</CardHeader>
					</Card>
					<ViewJoborderProfileTabs />
				</div>
			</div>
			{isModalOpen && (
				<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Delete Item</DialogTitle>
							<DialogDescription>
								Are you sure you want to delete this item? This action cannot be
								undone.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
							<Button
								variant="destructive"
								onClick={() => setIsModalOpen(false)}
							>
								Confirm
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
			{isReportModalOpen && (
				<Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Report Complete</DialogTitle>
							<DialogDescription>
								Are you sure to report complete this Joborder? Admin and Manager
								will be notified for confirmation.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button onClick={() => setIsReportModalOpen(false)}>
								Cancel
							</Button>
							<Button
								variant="default"
								onClick={() => setIsReportModalOpen(false)}
								className="bg-green-500"
							>
								Confirm
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}
