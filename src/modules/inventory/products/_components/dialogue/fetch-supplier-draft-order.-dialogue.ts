import {ApiRequest, request} from '@/api/axios';
import {Order} from '@/components/validation/order';
import {AxiosError} from 'axios';
import {toast} from 'sonner';

export const createPO = async (
	quantity: number,
	price: number,
	supplier_id: number,
	product_id: number,
	serialized: boolean,
	user: number,
) => {
	try {
		// Check if there is exisitng order with the supplier
		// If yes add this product with the quantity
		// if not create po with this selected supplier id
		const res = await request<ApiRequest<Order>>(
			'GET',
			`/api/v1/ims/order/product?supplier_id=${supplier_id}&status=Draft&no_pagination=true`,
		);
		const orderData: Order[] = Array.isArray(res.data) ? res.data : [res.data];
		if (orderData.length > 0) {
			// Create orderData, currently assuming that
			// we can only do 1 draft order for 1 supplier
			const newData = {
				order_id: orderData[0].order_id,
				product_id: product_id,
				total_quantity: quantity,
				ordered_quantity: quantity,
				cost_price: price.toString(),
				is_serialize: serialized,
				user: user,
			};
			await request<ApiRequest<Order>>(
				'POST',
				`/api/v1/ims/order/${orderData[0].order_id}/order-product`,
				newData,
			);
			toast.success(
				`Successfully Added to Purchase Order ID: ${orderData[0].order_id}`,
			);
		} else {
			const newData = {
				order_value: (price * quantity).toString(),
				user: user,
				supplier_id: supplier_id,
				order_status: 'Draft',
				order_products: [
					{
						product_id: product_id,
						is_serialize: serialized,
						total_quantity: quantity,
						ordered_quantity: quantity,
						cost_price: price.toString(),
					},
				],
			};
			await request<ApiRequest<Order>>('POST', `/api/v1/ims/order`, newData);

			toast.success(`Successfully Create new Purchase Order`);
		}
	} catch (e) {
		if (e instanceof Error) {
			toast.error(e.message.toString());
		} else if (e instanceof AxiosError) {
			toast.error(e.response?.data as string);
		} else {
			toast.error('An Unknown error occured');
		}
		console.log(e);
	}
};
