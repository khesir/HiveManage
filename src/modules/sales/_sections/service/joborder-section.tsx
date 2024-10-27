import {Heading} from '@/components/ui/heading';
import {Separator} from '@/components/ui/separator';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {JoborderList} from '../../service/joborder/joborder-list';
import {JoborderTabsList} from '../../service/joborder/joborder-tabs';
import {useJoborderStore} from '../../service/joborder/hook/useJoborderStore';
import {Button} from '@/components/ui/button';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import {dateParser} from '@/lib/util/utils';
import {File} from 'lucide-react';

export default function JoborderSection() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const {joborderData} = useJoborderStore();

	return (
		<div className="flex flex-col sm:gap-4">
			<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
				{/* Employee List */}
				<div className="grid items-start auto-rows-max gap-4 gap md:gap-6 lg:col-span-2">
					<div className="flex flex-col gap-4">
						<Heading
							title={`Joborder`}
							description="Manange Customer (Server side table functionalities.)"
						/>
						<Separator />
					</div>
					{/* Assigned Joborde list here */}
					<JoborderList searchParams={searchParams} />
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
									<File className="h-3.5 w-3.5" />
									<span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
										View More
									</span>
								</Button>
							</div>
						</CardHeader>
					</Card>
					<JoborderTabsList />
				</div>
			</div>
		</div>
	);
}
