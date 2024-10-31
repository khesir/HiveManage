import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import {dateParser} from '@/lib/util/utils';
import {useJoborderStore} from '../../service/joborder/hook/useJoborderStore';
import {Separator} from '@/components/ui/separator';
import {Button} from '@/components/ui/button';
import {Ticket} from 'lucide-react';
import {ViewJoborderTasks} from '../../service/joborder/view/view-joborder-tabs';
import {ViewJoborderProfileTabs} from '../../service/joborder/view/view-joborder-profile-tabs';
import {EmployeeCardCount} from '../../service/joborder/employee-card-count';
import {TaskAdd} from '../../service/joborder/view/form/taskAdd';
import useAddFormStatus from '../../service/joborder/hook/use-ticket-form';
import {useEffect, useState} from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

export default function JoborderView() {
	const {joborderData} = useJoborderStore();
	const {addStatus, setAddStatus} = useAddFormStatus();

	useEffect(() => {
		setAddStatus('main');
	}, []);

	// Modal Controls
	const [isModalOpen, setIsModalOpen] = useState(false);

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};
	return (
		<div className="flex flex-col sm:gap-4">
			<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
				{/* Employee List */}
				<div className="grid items-start auto-rows-max gap-4 gap md:gap-6 lg:col-span-2">
					{addStatus === 'main' ? (
						<>
							<div className="flex flex-col gap-4">
								<div className="flex justify-between gap-3">
									<Card className="w-[60%]" x-chunk="dashboard-05-chunk-1">
										<CardHeader className="pb-3">
											<CardTitle>Joborder</CardTitle>
											<div className="flex flex-col gap-3">
												<CardDescription className="max-w-lg text-balance leading-relaxed">
													Introducing Our Dynamic Orders Dashboard for Seamless
													Management and Insightful Analysis.
												</CardDescription>
												<div className="flex items-center gap-2">
													<Button className="h-8">Edit Joborder</Button>
													<Button
														className="h-8"
														variant={'destructive'}
														onClick={openModal}
													>
														Close Joborder
													</Button>
												</div>
											</div>
										</CardHeader>
									</Card>
									<EmployeeCardCount />
								</div>
							</div>
							<ViewJoborderTasks />
						</>
					) : (
						<TaskAdd />
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
								<Button size="sm" variant="default" className="h-8 gap-1">
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
							<Button onClick={closeModal}>Cancel</Button>
							<Button variant="destructive" onClick={closeModal}>
								Confirm
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}
