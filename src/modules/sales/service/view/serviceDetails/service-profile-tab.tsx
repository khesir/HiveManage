import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {LogsTabProduct} from '../logsRecord/logs-tab';
import {ServiceInformation} from '../service-details';
import {ServiceDetails} from './serviceDetailCard';
import useService from '../../../_components/hooks/use-service';

export function ServiceProfileTab() {
	const {data} = useService();
	return (
		<Tabs defaultValue="Information" className="space-y-2">
			<div className="flex items-center w-full">
				<TabsList className="w-full flex">
					<TabsTrigger className="flex-1" value="Information">
						Information
					</TabsTrigger>
					<TabsTrigger className="flex-1" value="Service Details">
						{`${data?.service_type?.name ? data?.service_type?.name : 'Service'} Details`}
					</TabsTrigger>
				</TabsList>
			</div>
			<TabsContent value="Information">
				<ServiceInformation />
			</TabsContent>
			<TabsContent value="Service Details">
				<ServiceDetails />
			</TabsContent>
			<TabsContent value="Logs">
				<LogsTabProduct />
			</TabsContent>
		</Tabs>
	);
}
