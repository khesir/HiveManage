import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {AddOrderProductDialogue} from './add-order-product-dialogue';
import {FinalizeOrder} from './finalize-order';
import {MarkComplete} from './mark-complete';
import useOrderStore from '@/api/order-state';
import {InformationProductTable} from '../order-product-list';
import {LogsTabOrder} from '../../logsRecord/logs-tab';
import {UpdateOrderForm} from './update-order-form';
import {UploadReceipt} from './uploadReciept';
export function ControlTabOrder() {
	const {selectedOrder, loading} = useOrderStore();

	return (
		<Tabs defaultValue="Informations">
			<div className="flex items-center justify-between mb-5">
				<TabsList>
					<TabsTrigger value="Informations">Informations</TabsTrigger>
					{/* <TabsTrigger value="Analytics">Analytics</TabsTrigger> */}
					<TabsTrigger value="Settings">Settings</TabsTrigger>
					<TabsTrigger value="Logs">Logs</TabsTrigger>
				</TabsList>
				{/* Possibly add a marquee here for announcements or something */}
				<div className="flex justify-end gap-3 md:gap-0">
					{/* Pending orders -- Controls*/}
					{!loading && selectedOrder.order_status === 'Draft' && (
						<div className="flex gap-3">
							<FinalizeOrder />
							<AddOrderProductDialogue />
						</div>
					)}
					{/* Payment */}
					{!loading && selectedOrder.order_status !== 'Draft' && (
						<div className="flex gap-3">
							<div>
								<UploadReceipt {...selectedOrder} />
							</div>
							{selectedOrder.order_status !== 'Fulfilled' && <MarkComplete />}
						</div>
					)}
				</div>
			</div>
			<TabsContent value="Informations">
				<InformationProductTable />
			</TabsContent>
			<TabsContent value="Settings">
				<UpdateOrderForm />
			</TabsContent>
			<TabsContent value="Logs">
				<LogsTabOrder />
			</TabsContent>
		</Tabs>
	);
}
