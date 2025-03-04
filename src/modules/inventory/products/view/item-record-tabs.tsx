import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import SerializeItemRecord from './record/serialize-item-list';
import {Separator} from '@/components/ui/separator';
import BatchRecordList from './record/batch-record-list';
import {OrderList} from '../../order/order-list';

interface InventoryRecordProps {
	searchParams: URLSearchParams;
	product_id: string;
	is_serialize: boolean;
}
export function ViewRecordTabs({
	product_id,
	searchParams,
	is_serialize = false,
}: InventoryRecordProps) {
	return (
		<Tabs defaultValue="Records" className="p-3 w-full">
			<div className="flex items-center">
				<TabsList>
					<TabsTrigger value="Records">Records</TabsTrigger>
					<TabsTrigger value="Orders">Orders</TabsTrigger>
				</TabsList>
				{/* Possibly add a marquee here for announcements or something */}
			</div>
			<TabsContent value="Records">
				{is_serialize ? (
					<SerializeItemRecord
						searchParams={searchParams}
						product_id={product_id}
					/>
				) : (
					<BatchRecordList
						searchParams={searchParams}
						product_id={product_id}
					/>
				)}
			</TabsContent>
			<TabsContent value="Orders">
				<div className="flex flex-col pt-5 gap-3">
					<div className="pb-2">
						<h3 className="text-xl font-medium">Orders</h3>
						<p className="text-sm text-muted-foreground">
							This is how others will see you on the site.
						</p>
					</div>
					<Separator />
					<OrderList searchParams={searchParams} product_id={product_id} />
				</div>
			</TabsContent>
		</Tabs>
	);
}
