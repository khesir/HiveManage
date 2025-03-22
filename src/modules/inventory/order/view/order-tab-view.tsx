import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {InformationSection} from './information/information-section';

export function OrderViewTab() {
	return (
		<Tabs defaultValue="Informations" className="p-3">
			<div className="flex items-center">
				<TabsList>
					<TabsTrigger value="Informations">Informations</TabsTrigger>
					{/* <TabsTrigger value="Analytics">Analytics</TabsTrigger> */}
					<TabsTrigger value="Settings">Settings</TabsTrigger>
				</TabsList>
				{/* Possibly add a marquee here for announcements or something */}
			</div>
			<TabsContent value="Informations">
				<InformationSection />
			</TabsContent>
			<TabsContent value="Settings">
				<div>For updating information for order or product</div>
			</TabsContent>
		</Tabs>
	);
}
