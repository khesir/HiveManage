import {ApiRequest, request} from '@/api/axios';
import {Order} from '@/components/validation/order';
import {AxiosError} from 'axios';
import {toast} from 'sonner';

export const createPO = async (
	quantity: number,
	supplier_id: number,
	product_id: number,
) => {
	try {
		console.log({
			quantity: quantity,
			supplier_id: supplier_id,
			product_id: product_id,
		});
		// Check if there is exisitng order with the supplier
		// If yes add this product with the quantity
		// if not create po with this selected supplier id
		const res = await request<ApiRequest<Order>>(
			'GET',
			`/api/v1/ims/order?supplier_id=${supplier_id}&status=Draft`,
		);
		let orderData: Order;
		if (!Array.isArray(res.data)) {
			orderData = res.data;
		} else {
			orderData = res.data[0];
		}

		if (orderData.order_id) {
			// Create orderData
			console.log('');
		} else {
			// const orderData = {}
			console.log('');
		}
	} catch (e) {
		if (e instanceof Error) {
			toast.error(e.message.toString());
		} else if (e instanceof AxiosError) {
			toast.error(e.response?.data as string);
		} else {
			toast.error('An Unknown error occured');
		}
	}
};
