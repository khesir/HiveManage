import {Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/ui/tabs';
import {JoborderProfiler} from './joborder-profile';
import {JoborderTaskList} from './joborder-task-list';
import {useJoborderStore} from '../../_components/hooks/use-joborder-store.ts';
import {Card, CardHeader} from '@/components/ui/card';

export function JoborderTabsList() {
	const {joborderData} = useJoborderStore();
	if (!joborderData) {
		return (
			<Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
				<CardHeader className="flex flex-row items-start bg-muted/50">
					Not Found
				</CardHeader>
			</Card>
		);
	}
	console.log(joborderData);
	return (
		<Tabs defaultValue="Profile">
			<TabsList>
				<TabsTrigger value="Profile">Profile</TabsTrigger>
				<TabsTrigger value="Services">Tasks</TabsTrigger>
			</TabsList>
			<TabsContent value="Profile">
				<JoborderProfiler data={joborderData} />
			</TabsContent>
			<TabsContent value="Services">
				<JoborderTaskList joborderData={joborderData} />
			</TabsContent>
		</Tabs>
	);
}
