import {Separator} from '@/components/ui/separator';
import {ViewCustomerDetails} from '../../../customer/view/customer-details';
import {CustomerProfile} from '../../../customer/list/customer-profile';

export default function CustomerViewSection() {
	return (
		<div className="flex flex-col sm:gap-4">
			<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
				{/* Employee List */}
				<div className="grid items-start auto-rows-max gap-4 gap md:gap-6 lg:col-span-2">
					<div className="flex flex-col gap-4">
						<ViewCustomerDetails />
					</div>
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex lg:hidden">
						<Separator />
					</div>
					{/* Employee Profile */}
					<CustomerProfile />
				</div>
			</div>
		</div>
	);
}
