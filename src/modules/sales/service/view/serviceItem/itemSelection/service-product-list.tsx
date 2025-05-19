import {PaginationResponse, request} from '@/api/axios';
import {useEffect, useState} from 'react';
import {columns} from './service-product-columns';
import {SalesProductTable} from './service-product-table';
import useEventTrigger from '../../../_components/use-event-hook';
import {Product} from '@/components/validation/product';
type Props = {
	onSubmit: () => void;
};
export default function ServiceProductList({onSubmit}: Props) {
	const [products, setProducts] = useState<Product[]>([]);

	const {isTriggered} = useEventTrigger();

	useEffect(() => {
		const fetchProducts = async () => {
			const res = await request<PaginationResponse<Product>>(
				'GET',
				`/api/v1/ims/product?no_pagination=true&status=Available&is_service=true`,
			);
			setProducts(res.data);
		};
		fetchProducts();
	}, [isTriggered]);

	return (
		<SalesProductTable
			columns={columns}
			rowData={products}
			onSubmit={onSubmit}
		/>
	);
}
