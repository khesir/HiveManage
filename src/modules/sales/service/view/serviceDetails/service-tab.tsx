import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {LogsTabProduct} from '../logsRecord/logs-tab';
import OwnedItemList from '../ownedItems/owned-items-list';
import ServiceItemList from '../serviceItem/service-item-list';

export function ServiceTab() {
	return (
		<Tabs defaultValue="Service Items" className="spacey-y-3">
			<div className="flex items-center">
				<TabsList>
					<TabsTrigger value="Service Items">Service Items</TabsTrigger>
					<TabsTrigger value="Customer Items">Customer Items</TabsTrigger>
					<TabsTrigger value="Logs">Logs</TabsTrigger>
				</TabsList>
			</div>
			<TabsContent value="Service Items">
				<ServiceItemList />
			</TabsContent>
			<TabsContent value="Customer Items">
				<OwnedItemList />
			</TabsContent>
			<TabsContent value="Logs">
				<LogsTabProduct />
			</TabsContent>
		</Tabs>
	);
}
