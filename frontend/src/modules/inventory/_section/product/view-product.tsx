import {ViewItemTabDetails} from '../../products/view/item-tab-view';
import {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import useProducts from '../../_components/hooks/use-products';
import {ApiRequest, request} from '@/api/axios';
import {Product} from '@/components/validation/product';

export default function ViewProductRecord() {
	const {id} = useParams();
	const {setProduct} = useProducts();
	useEffect(() => {
		const fetchData = async () => {
			const res = await request<ApiRequest<Product>>(
				'GET',
				`/api/v1/ims/product/${id}`,
			);
			if (Array.isArray(res.data)) {
				setProduct(res.data[0]);
			} else {
				setProduct(res.data);
			}
		};
		fetchData();
	}, []);
	return (
		<div className="flex flex-col sm:gap-4">
			<ViewItemTabDetails />
		</div>
	);
}
