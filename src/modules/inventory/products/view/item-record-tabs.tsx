import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import ItemRecordList from './tables/itemRecords/item-record-list';
import VariantList from './tables/variants/variant-list';
import ItemList from './tables/items/item-list';

interface InventoryRecordProps {
	searchParams: URLSearchParams;
	product_id: string;
}
export function ViewRecordTabs({
	searchParams,
	product_id,
}: InventoryRecordProps) {
	return (
		<Tabs defaultValue="Items" className="p-3 w-full">
			<div className="flex items-center">
				<TabsList>
					<TabsTrigger value="Items">Items</TabsTrigger>
					<TabsTrigger value="Records">Records</TabsTrigger>
					<TabsTrigger value="Variants">Variants</TabsTrigger>
				</TabsList>
				{/* Possibly add a marquee here for announcements or something */}
			</div>
			<TabsContent value="Items">
				<ItemList searchParams={searchParams} product_id={product_id} />
			</TabsContent>
			<TabsContent value="Records">
				<ItemRecordList searchParams={searchParams} product_id={product_id} />
			</TabsContent>
			<TabsContent value="Variants">
				<VariantList searchParams={searchParams} product_id={product_id} />
			</TabsContent>
		</Tabs>
	);
}
