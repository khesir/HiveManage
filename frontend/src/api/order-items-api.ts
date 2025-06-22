import {AxiosError} from 'axios';
import {toast} from 'sonner';
import {PaginationResponse, request} from './axios';
import {OrderProduct} from '@/components/validation/order-product';

export const getAllOrderItems = async (
	paramsId?: number,
): Promise<OrderProduct[]> => {
	try {
		const response = await request<PaginationResponse<OrderProduct>>(
			'GET',
			`/api/v1/ims/order-product?no_pagination=true&` +
				`product_id=${paramsId}`,
		);
		return response.data;
	} catch (e) {
		if (e instanceof Error) {
			toast.error(e.toString());
		} else if (e instanceof AxiosError) {
			toast.error(e.response?.data as string);
		} else {
			toast.error('An unknown error occured');
		}
		return [];
	}
};
