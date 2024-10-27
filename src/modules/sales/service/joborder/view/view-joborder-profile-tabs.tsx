import {Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/ui/tabs';
import {JoborderProfile} from '../joborder-profile';

export function ViewJoborderProfileTabs() {
	return (
		<Tabs defaultValue="Profile">
			<TabsList>
				<TabsTrigger value="Profile">Information</TabsTrigger>
				<TabsTrigger value="Calculation">Price Breakdown</TabsTrigger>
				<TabsTrigger value="Reports">Reprots History</TabsTrigger>
			</TabsList>
			<TabsContent value="Profile">
				<JoborderProfile />
			</TabsContent>
			<TabsContent value="Calculation">
				<p>Price Calculation</p>
			</TabsContent>
		</Tabs>
	);
}
