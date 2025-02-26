import ProductWithDetailsList from '../../products/product-list';
import {useSearchParams} from 'react-router-dom';

import {Separator} from '@radix-ui/react-dropdown-menu';
import {ProductProfile} from '../../_components/product/product-profile';
import {Heading} from '@/components/ui/heading';

export default function InventorySection() {
	const [searchParams] = useSearchParams();

	return (
		<div className="flex flex-col sm:gap-4">
			<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
				{/* Employee List */}

				<div className="grid items-start auto-rows-max gap-4 gap md:gap-6 lg:col-span-2">
					<div className="flex flex-col gap-4">
						<Heading
							title={`Products`}
							description="Manange Customer (Server side table functionalities.)"
						/>
						<Separator />
					</div>
					<ProductWithDetailsList searchParams={searchParams} />
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex lg:hidden">
						<Separator />
					</div>
					{/* Service Profile */}
					<ProductProfile />
				</div>
			</div>
		</div>
	);
}
