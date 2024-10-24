import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {TabsContent} from '@radix-ui/react-tabs';
import {SalesAllItem} from './sales-all-items';
import {SalesServiceAccordionListCard} from './sales-services-accordion';

export function ViewSalesTabList() {
	return (
		<Tabs defaultValue="Items">
			<TabsList>
				<TabsTrigger value="Items">All Items</TabsTrigger>
				<TabsTrigger value="Services">Services</TabsTrigger>
			</TabsList>
			<TabsContent value="Items">
				<SalesAllItem />
			</TabsContent>
			<TabsContent value="Services">
				<SalesServiceAccordionListCard />
			</TabsContent>
		</Tabs>
	);
}
