import useProductStore from '@/api/product-state';
import {ViewItemTabDetails} from '../../products/view/item-tab-view';
import {useEffect} from 'react';
import {useParams} from 'react-router-dom';

export default function ViewProductRecord() {
	const {id} = useParams();
	const {getProductById, selectedProduct} = useProductStore();
	console.log(selectedProduct);
	useEffect(() => {
		getProductById(Number(id));
	}, []);
	return (
		<div className="flex flex-col sm:gap-4">
			<ViewItemTabDetails />
		</div>
	);
}
