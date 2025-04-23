import {Separator} from '@/components/ui/separator';
import {Heading} from '@/components/ui/heading';
import SupplierList from '../../suppliers/supplier-list';
import {SupplierProfile} from '../../suppliers/supplier-profile';

export default function SupplierListView() {
	return (
		<div className="flex flex-col sm:gap-4">
			<div className="flex flex-row items-center justify-between gap-4 px-4">
				<div className="grid items-start auto-rows-max gap-4 gap md:gap-6 lg:col-span-2">
					<div className="flex flex-col gap-4">
						<Heading
							title={`Supplier Database`}
							description="Manange Supplier (Server side table functionalities.)"
						/>{' '}
						<Separator />
					</div>
					<SupplierList />
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex lg:hidden">
						<Separator />
					</div>
					{/* Service Profile */}
					<SupplierProfile />
				</div>
			</div>
		</div>
	);
}
