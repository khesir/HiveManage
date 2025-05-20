import {PaginationResponse, request} from '@/api/axios';
import {useEffect, useState} from 'react';
import {columns} from './service-product-columns';
import {SalesProductTable} from './service-product-table';
import useEventTrigger from '../../../_components/use-event-hook';
import {Product} from '@/components/validation/product';
import useService from '@/modules/sales/_components/hooks/use-service';
type Props = {
	onSubmit: () => void;
};
export default function ServiceProductList({onSubmit}: Props) {
	const [products, setProducts] = useState<Product[]>([]);
	const {data} = useService();

	const {isTriggered} = useEventTrigger();

	useEffect(() => {
		const fetchProducts = async () => {
			const res = await request<PaginationResponse<Product>>(
				'GET',
				`/api/v1/ims/product?no_pagination=true&status=Available` +
					(data?.service_type?.name === 'Rent'
						? `&is_rent=true`
						: '&is_service=true'),
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
