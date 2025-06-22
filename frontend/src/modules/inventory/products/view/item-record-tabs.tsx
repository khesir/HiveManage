import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import BatchRecordList from './record/batch-record-list';
import {OrderList} from './order/order-list';

interface InventoryRecordProps {
	searchParams: URLSearchParams;
	product_id: string;
	is_serialize: boolean;
}
export function ViewRecordTabs({
	product_id,
	searchParams,
}: InventoryRecordProps) {
	return (
		<Tabs defaultValue="Records" className="p-3 w-full">
			<div className="flex items-center">
				<TabsList>
					<TabsTrigger value="Records">Records</TabsTrigger>
					<TabsTrigger value="Orders">Orders</TabsTrigger>
				</TabsList>
			</div>
			<TabsContent value="Records">
				<BatchRecordList searchParams={searchParams} product_id={product_id} />
			</TabsContent>
			<TabsContent value="Orders">
				<OrderList />
			</TabsContent>
		</Tabs>
	);
}
