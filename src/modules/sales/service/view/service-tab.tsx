import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {ServiceDetails} from './service-details';
import {LogsTabProduct} from './logsRecord/logs-tab';

export function ServiceTab() {
	return (
		<Tabs defaultValue="Informations" className="p-3">
			<div className="flex items-center">
				<TabsList>
					<TabsTrigger value="Informations">Information</TabsTrigger>
					<TabsTrigger value="Logs">Logs</TabsTrigger>
					<TabsTrigger value="Settings">Settings</TabsTrigger>
				</TabsList>
			</div>
			<TabsContent value="Informations">
				<ServiceDetails />
			</TabsContent>
			<TabsContent value="Logs">
				<LogsTabProduct />
			</TabsContent>
			<TabsContent value="Settings"></TabsContent>
		</Tabs>
	);
}
