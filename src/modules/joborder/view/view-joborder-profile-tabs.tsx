import {Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/ui/tabs';
import {JoborderProfiler} from '../../sales/service/joborder/joborder-profile';
import {Card, CardHeader} from '@/components/ui/card';
import {useJoborderStore} from '@/modules/sales/_components/hooks/use-joborder-store';
import {JoborderPriceBreakDown} from './joborder-price-breakdown';
import {ReportsHistory} from './reports-list';

export function ViewJoborderProfileTabs() {
	const {joborderData} = useJoborderStore();
	if (!joborderData) {
		return (
			<Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
				<CardHeader className="flex flex-row items-start bg-muted/50">
					Not Found
				</CardHeader>
			</Card>
		);
	}
	return (
		<Tabs defaultValue="Profile">
			<TabsList>
				<TabsTrigger value="Profile">Information</TabsTrigger>
				<TabsTrigger value="Calculation">Price Breakdown</TabsTrigger>
				<TabsTrigger value="Reports">Reports History</TabsTrigger>
			</TabsList>
			<TabsContent value="Profile">
				<JoborderProfiler data={joborderData} />
			</TabsContent>
			<TabsContent value="Calculation">
				<JoborderPriceBreakDown data={joborderData} />
			</TabsContent>
			<TabsContent value="Reports">
				<ReportsHistory data={joborderData} />
			</TabsContent>
		</Tabs>
	);
}
