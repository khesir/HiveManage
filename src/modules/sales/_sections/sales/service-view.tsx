import {Card} from '@/components/ui/card';
import {Heading} from '@/components/ui/heading';
import {Separator} from '@/components/ui/separator';
import {ViewSalesTabList} from '../../sales/view/sales-tab-view-list';

export default function ServiceViewPage() {
	return (
		<div className="flex flex-col sm:gap-4">
			<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
				{/* Employee List */}
				<div className="grid items-start auto-rows-max gap-4 gap md:gap-6 lg:col-span-2">
					<div className="flex flex-col gap-4">
						<Heading
							title={`Services`}
							description="Choose what to view from borrow, reserve and "
						/>
						<Separator />
					</div>
					<ViewSalesTabList />
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex lg:hidden">
						<Separator />
					</div>
					{/* Employee Profile */}
					<Card>Service Details: header </Card>
					<Card>
						Payment: Total cost tracking, Payment History, actual total payment
						- redirect to payment page
					</Card>
				</div>
			</div>
		</div>
	);
}
