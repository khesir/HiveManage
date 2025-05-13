import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {ProductInformationTab} from './information/information-tab';
import SettingsSidebar from './settings/settings-sidebar';
import {LogsTabProduct} from './logsRecord/logs-tab';
import useProducts from '../../_components/hooks/use-products';
import SerializeItemRecord from './record/serialize-item-list';

export function ViewItemTabDetails() {
	const {data} = useProducts();
	return (
		<Tabs defaultValue="Informations" className="p-3">
			<div className="flex items-center">
				<TabsList>
					<TabsTrigger value="Informations">Informations</TabsTrigger>
					{data?.is_serialize && (
						<TabsTrigger value="Serial">Serialized Records</TabsTrigger>
					)}
					<TabsTrigger value="Settings">Settings</TabsTrigger>
					<TabsTrigger value="Logs">Logs</TabsTrigger>
				</TabsList>
				{/* Possibly add a marquee here for announcements or something */}
			</div>
			<TabsContent value="Informations">
				<ProductInformationTab />
			</TabsContent>
			<TabsContent value="Serial">
				<SerializeItemRecord />
			</TabsContent>
			<TabsContent value="Settings">
				<SettingsSidebar />
			</TabsContent>
			<TabsContent value="Logs">
				<LogsTabProduct />
			</TabsContent>
		</Tabs>
	);
}
