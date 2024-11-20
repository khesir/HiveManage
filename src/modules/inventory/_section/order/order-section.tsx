import {OrderList} from '../../order/order-list';

import {OrderControls} from '../../order/order-controls';
import {OrderContent} from '../../order/order-content';
import useOrderStore from '../../_components/hooks/use-orders';
import {useEffect} from 'react';

export default function OrderSection() {
	const {resetOrder} = useOrderStore();
	useEffect(() => {
		resetOrder();
	}, []);
	return (
		<div className="flex flex-col sm:gap-4">
			<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
				{/*  */}
				<div className="flex flex-col gap-4 col-span-2">
					<OrderContent />
				</div>
				<div className="grid items-start auto-rows-max gap-4 gap md:gap-6 lg:col-span-1">
					<OrderControls />
					<OrderList />
				</div>
			</div>
		</div>
	);
}
