import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from '@/components/ui/card';
import {dateParser} from '@/lib/util/utils';
import {useNavigate} from 'react-router-dom';
import {useJoborderStore} from '../../service/joborder/hook/useJoborderStore';
import {Separator} from '@/components/ui/separator';
import {Button} from '@/components/ui/button';
import {Ticket} from 'lucide-react';
import {AvatarCircles} from '@/components/ui/avatarcircles';
import {ViewJoborderTasks} from '../../service/joborder/view/view-joborder-tabs';
import {ViewJoborderProfileTabs} from '../../service/joborder/view/view-joborder-profile-tabs';

export default function JoborderView() {
	const navigate = useNavigate();
	const {joborderData} = useJoborderStore();

	return (
		<div className="flex flex-col sm:gap-4">
			<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
				{/* Employee List */}
				<div className="grid items-start auto-rows-max gap-4 gap md:gap-6 lg:col-span-2">
					<div className="flex flex-col gap-4">
						<div className="flex justify-between gap-3">
							{/* <Heading
								title={`Joborder`}
								description="Manange Customer (Server side table functionalities.)"
							/> */}
							<Card className="w-[60%]" x-chunk="dashboard-05-chunk-1">
								<CardHeader className="pb-3">
									<CardTitle>Joborder</CardTitle>
									<CardDescription className="max-w-lg text-balance leading-relaxed">
										Introducing Our Dynamic Orders Dashboard for Seamless
										Management and Insightful Analysis.
									</CardDescription>
								</CardHeader>
							</Card>
							<Card className="w-[40%]" x-chunk="dashboard-05-chunk-1">
								<CardHeader className="pb-2">
									<CardTitle>Employees</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-xs text-muted-foreground">
										+14 employee is in this JO
									</div>
								</CardContent>
								<CardFooter>
									<AvatarCircles
										avatarUrls={['#', '#', '#', '#']}
										numPeople={10}
									/>
								</CardFooter>
							</Card>
						</div>
					</div>
					{/* Assigned Joborde list here */}
					<ViewJoborderTasks />
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
									onClick={() => {
										navigate(`view/${joborderData?.joborder_id}`);
									}}
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
		</div>
	);
}
