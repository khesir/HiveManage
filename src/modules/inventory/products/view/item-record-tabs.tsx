import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import ItemRecordList from './item-record-list';
import VariantList from './variants/variant-list';

interface InventoryRecordProps {
	searchParams: URLSearchParams;
	product_id: string;
}
export function ViewRecordTabs({
	searchParams,
	product_id,
}: InventoryRecordProps) {
	return (
		<Tabs defaultValue="Records" className="p-3">
			<div className="flex items-center">
				<TabsList>
					<TabsTrigger value="Records">Records</TabsTrigger>
					<TabsTrigger value="Variants">Variants</TabsTrigger>
				</TabsList>
				{/* Possibly add a marquee here for announcements or something */}
			</div>
			<TabsContent value="Records">
				<ItemRecordList searchParams={searchParams} product_id={product_id} />
			</TabsContent>
			<TabsContent value="Variants">
				<VariantList searchParams={searchParams} product_id={product_id} />
			</TabsContent>
		</Tabs>
	);
}
