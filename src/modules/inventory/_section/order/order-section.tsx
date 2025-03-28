import {OrderList} from '../../order/order-list';
import {useEffect} from 'react';
import {Heading} from '@/components/ui/heading';
import {Separator} from '@/components/ui/separator';
import {useSearchParams} from 'react-router-dom';
import {OrderProfile} from '../../order/order-profile';
import useOrderStore from '@/api/order';

export default function OrderSection() {
	const {fetchOrders} = useOrderStore();
	const [searchParams] = useSearchParams();
	useEffect(() => {
		fetchOrders(searchParams);
	}, []);
	return (
		<div className="flex flex-col sm:gap-4">
			<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
				<div className="grid items-start auto-rows-max gap-4 gap md:gap-6 lg:col-span-2">
					<div className="flex flex-col gap-4">
						<Heading title={`Orders`} description="Supplier Based orders" />
						<Separator />
					</div>
					<OrderList searchParams={searchParams} product_id={undefined} />
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex lg:hidden">
						<Separator />
					</div>
					{/* Service Profile */}
					<OrderProfile />
				</div>
			</div>
		</div>
	);
}
