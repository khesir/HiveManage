import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {ProductInformationTab} from './information/information-tab';
import SettingsSidebar from './settings/settings-sidebar';
import {LogsTabProduct} from './logsRecord/logs-tab';

export function ViewItemTabDetails() {
	return (
		<Tabs defaultValue="Informations" className="p-3">
			<div className="flex items-center">
				<TabsList>
					<TabsTrigger value="Informations">Informations</TabsTrigger>
					{/* <TabsTrigger value="Analytics">Analytics</TabsTrigger> */}
					<TabsTrigger value="Settings">Settings</TabsTrigger>
					<TabsTrigger value="Logs">Logs</TabsTrigger>
				</TabsList>
				{/* Possibly add a marquee here for announcements or something */}
			</div>
			<TabsContent value="Informations">
				<ProductInformationTab />
			</TabsContent>
			{/* <TabsContent value="Analytics">
				<p>Product Analysis chuchu</p>
			</TabsContent> */}
			<TabsContent value="Settings">
				<SettingsSidebar />
			</TabsContent>
			<TabsContent value="Logs">
				<LogsTabProduct />
			</TabsContent>
		</Tabs>
	);
}
