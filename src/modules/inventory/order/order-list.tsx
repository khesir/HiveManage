import {useEffect, useState} from 'react';
import {PaginationResponse, request} from '@/api/axios';

import useOrderStore from '../_components/hooks/use-orders';
import {OrderDataTable} from './order-table';
import {columns} from './columns';
import {Order} from '@/components/validation/order';
import useEventTrigger from '../_components/hooks/use-event-trigger';

interface ProductWithDetails {
	searchParams: URLSearchParams;
	product_id: string | undefined;
}

export function OrderList({
	searchParams,
	product_id = undefined,
}: ProductWithDetails) {
	const [orders, setOrders] = useState<Order[]>([]);
	const [pageCount, setPageCount] = useState<number>(0);

	const page = Number(searchParams.get('page')) || 1;
	const pageLimit = Number(searchParams.get('limit')) || 10;
	const sort = searchParams.get('sort') || null;
	const offset = (page - 1) * pageLimit;
	// Interactivity
	const {setOrder} = useOrderStore();
	const {toggleTrigger} = useEventTrigger();

	useEffect(() => {
		const fetchProducts = async () => {
			if (product_id) {
				const res = await request<PaginationResponse<Order>>(
					'GET',
					`/api/v1/ims/order?limit=${pageLimit}&offset=${offset}` +
						(sort ? `&sort=${sort}` : '') +
						'&includes=order_products,supplier',
				);
				setOrders(res.data);
				setOrder(res.data[0]);
				setPageCount(Math.ceil(res.total_data / pageLimit));
			} else {
				const res = await request<PaginationResponse<Order>>(
					'GET',
					`/api/v1/ims/order?limit=${pageLimit}&offset=${offset}` +
						(sort ? `&sort=${sort}` : '') +
						'&includes=order_products,supplier',
				);
				setOrders(res.data);
				setOrder(res.data[0]);
				setPageCount(Math.ceil(res.total_data / pageLimit));
			}
		};
		fetchProducts();
	}, [offset, pageLimit, toggleTrigger, sort]);
	return (
		<OrderDataTable columns={columns} data={orders} pageCount={pageCount} />
	);
}
