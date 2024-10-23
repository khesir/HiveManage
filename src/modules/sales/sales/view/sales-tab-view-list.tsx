import {Card} from '@/components/ui/card';
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {TabsContent} from '@radix-ui/react-tabs';

export function ViewSalesTabList() {
	return (
		<Tabs defaultValue="Items">
			<TabsList>
				<TabsTrigger value="Items">All Items</TabsTrigger>
				<TabsTrigger value="Services">Services</TabsTrigger>
			</TabsList>
			<TabsContent value="Items">
				<Card>Tabcontent: items </Card>
				<Card>
					Paginated table - Add sales Item - view item details (click view or
					hover view)
				</Card>
			</TabsContent>
			<TabsContent value="Services">
				<Card>Tabcontent: Services </Card>
				<Card>
					Joborder Section - create button - redirect to dedicated page
				</Card>
				<Card>Borrow Section - create button - redirect to dedicated page</Card>
				<Card>
					Reserve Section - create button - redirect to dedicated page
				</Card>
			</TabsContent>
		</Tabs>
	);
}
