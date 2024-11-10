import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {EmployeeInformationListCard} from './employee-information-list-card';
import SettingsSidebar from './settings/setting-sidebar';

export function ViewEmployeeDetails() {
	return (
		<Tabs defaultValue="Informations" className="p-3">
			<div className="flex items-center">
				<TabsList>
					<TabsTrigger value="Informations">Informations</TabsTrigger>
					<TabsTrigger value="Settings">Settings</TabsTrigger>
				</TabsList>
				{/* Possibly add a marquee here for announcements or something */}
			</div>
			<TabsContent value="Informations">
				<EmployeeInformationListCard />
			</TabsContent>
			<TabsContent value="Settings">
				<SettingsSidebar />
			</TabsContent>
		</Tabs>
	);
}
