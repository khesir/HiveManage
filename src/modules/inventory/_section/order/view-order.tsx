import {useParams} from 'react-router-dom';
import {OrderViewTab} from '../../order/view/order-tab-view';
import {useEffect} from 'react';
import useOrderStore from '@/api/order';

export default function ViewOrderSection() {
	const {id} = useParams();
	const {getOrderById} = useOrderStore();
	useEffect(() => {
		getOrderById(Number(id));
	}, []);
	return (
		<div className="w-full">
			<OrderViewTab />
		</div>
	);
}
