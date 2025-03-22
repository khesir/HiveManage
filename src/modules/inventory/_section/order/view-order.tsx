import {useParams, useSearchParams} from 'react-router-dom';
import {OrderViewTab} from '../../order/view/order-tab-view';
import {useEffect} from 'react';
import useOrderStore from '@/api/order';

export default function ViewOrderSection() {
	const {id} = useParams();
	const {fetchOrders} = useOrderStore();
	const [searchParams] = useSearchParams();
	useEffect(() => {
		fetchOrders(searchParams);
	}, []);
	return (
		<div className="flex col sm:gap-4">
			<OrderViewTab />
		</div>
	);
}
