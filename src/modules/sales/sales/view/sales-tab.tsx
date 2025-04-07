import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';

export function SalesTab() {
	return (
		<Tabs defaultValue="Informations" className="p-3">
			<div className="flex items-center">
				<TabsList>
					<TabsTrigger value="Informations">Informations</TabsTrigger>
					{/* <TabsTrigger value="Analytics">Analytics</TabsTrigger> */}
				</TabsList>
				{/* Possibly add a marquee here for announcements or something */}
			</div>
			<TabsContent value="Informations">
				<div>Table</div>
			</TabsContent>
		</Tabs>
	);
}
