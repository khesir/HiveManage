import {Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/ui/tabs';
import {JoborderProfile} from './joborder-profile';
import {JoborderTaskList} from './joborder-task-list';

export function JoborderTabsList() {
	return (
		<Tabs defaultValue="Profile">
			<TabsList>
				<TabsTrigger value="Profile">Profile</TabsTrigger>
				<TabsTrigger value="Services">Tasks</TabsTrigger>
			</TabsList>
			<TabsContent value="Profile">
				<JoborderProfile />
			</TabsContent>
			<TabsContent value="Services">
				<JoborderTaskList />
			</TabsContent>
		</Tabs>
	);
}
