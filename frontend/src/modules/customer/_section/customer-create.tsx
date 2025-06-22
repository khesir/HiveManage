import {Separator} from '@/components/ui/separator';
import {Heading} from '@/components/ui/heading';
import {CreateCustomerForm} from '../customer/create/create-customer';
import {CreateCustomerOverview} from '../customer/create/create-customer-overview';

export default function CreateCustomerSection() {
	return (
		<div className="flex flex-col sm:gap-4">
			<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
				<div className="grid items-start auto-rows-max gap-4 gap md:gap-6 lg:col-span-2">
					<div className="flex flex-col gap-4">
						<Heading
							title={`Create Employee`}
							description="Fill up the form and complete all the steps"
						/>
						<Separator />
					</div>
					<CreateCustomerForm />
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex lg:hidden">
						<Separator />
					</div>
					{/* Employee Profile */}
					<CreateCustomerOverview />
				</div>
			</div>
		</div>
	);
}
