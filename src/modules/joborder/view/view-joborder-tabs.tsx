import {Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/ui/tabs';
import {SalesAllItem} from '@/modules/sales/service/view/sales-all-items';
import {TaskList} from './tasklist/tasklist-list';

export function ViewJoborderTasks() {
	return (
		<Tabs defaultValue="Tasks">
			<TabsList>
				<TabsTrigger value="Tasks">Tasks</TabsTrigger>
				<TabsTrigger value="Items">Items</TabsTrigger>
			</TabsList>
			<TabsContent value="Tasks">
				<TaskList />
			</TabsContent>
			<TabsContent value="Items">
				<SalesAllItem item_type="Joborder" />
			</TabsContent>
		</Tabs>
	);
}
