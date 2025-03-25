import {Order} from '@/components/validation/inventory/order';
import {AxiosError} from 'axios';
import {create} from 'zustand';
import {ApiRequest, PaginationResponse, request} from './axios';
import {OrderProduct} from '@/components/validation/inventory/order-product';

type OrderState = {
	orders: Order[];
	selectedOrder: Order;
	loading: boolean;
	fetchOrders: (params: URLSearchParams) => Promise<void>;
	getOrderById: (orderId: number) => Promise<Order | undefined>;
	addOrder: (newOrder: Omit<Order, 'id'>) => Promise<void>;
	deleteOrder: (orderId: number) => Promise<void>;
	addOrderItem: (orderId: number, newItem: OrderProduct) => void;
	removeOrderItem: (orderId: number, itemId: number) => void;
};

const useOrderStore = create<OrderState>((set, get) => ({
	orders: [],
	selectedOrder: {} as Order,
	loading: false,

	fetchOrders: async (params: URLSearchParams) => {
		set({loading: true});
		try {
			const page = Number(params.get('page')) || 1;
			const pageLimit = Number(params.get('limit')) || 10;
			const sort = params.get('sort') || null;
			const offset = (page - 1) * pageLimit;

			const response = await request<PaginationResponse<Order>>(
				'GET',
				`/api/v1/ims/order?limit=${pageLimit}&offset=${offset}` +
					(sort ? `&sort=${sort}` : '') +
					'&includes=order_products,supplier',
			);
			set({orders: response.data, loading: false});
		} catch (e) {
			if (e instanceof Error) {
				console.log(e.toString());
			} else if (e instanceof AxiosError) {
				console.log(e.response?.data as string);
			} else {
				console.log('An unknown error occured');
			}
			set({loading: false});
		}
	},
	getOrderById: async (orderId) => {
		set({loading: true});
		const existingOrder = get().orders.find((o) => o.order_id === orderId);
		if (existingOrder) {
			set({selectedOrder: existingOrder, loading: false});
			return existingOrder;
		}
		try {
			const response = await request<ApiRequest<Order>>(
				'GET',
				`/api/v1/ims/order/${orderId}?includes=order_products,supplier,product`,
			);
			let orderData: Order;
			if (!Array.isArray(response.data)) {
				orderData = response.data;
			} else {
				orderData = response.data[0];
			}
			set((state) => ({orders: [...state.orders, orderData as Order]}));
			set({loading: false});
			set({selectedOrder: orderData});
		} catch (e) {
			if (e instanceof Error) {
				console.log(e.toString());
			} else if (e instanceof AxiosError) {
				console.log(e.response?.data as string);
			} else {
				console.log('An unknown error occured');
			}
		} finally {
			set({loading: false});
		}
	},
	addOrder: async (newOrder) => {
		set({loading: true});
		try {
			console.log(newOrder);
		} catch (e) {
			if (e instanceof Error) {
				console.log(e.toString());
			} else if (e instanceof AxiosError) {
				console.log(e.response?.data as string);
			} else {
				console.log('An unknown error occured');
			}
		} finally {
			set({loading: false});
		}
	},
	deleteOrder: async (orderId) => {
		set({loading: true});
		try {
			console.log(orderId);
		} catch (e) {
			if (e instanceof Error) {
				console.log(e.toString());
			} else if (e instanceof AxiosError) {
				console.log(e.response?.data as string);
			} else {
				console.log('An unknown error occured');
			}
		} finally {
			set({loading: false});
		}
	},
	addOrderItem: async (orderId: number, newItem: OrderProduct) => {
		set({loading: true});
		try {
			await request(
				'POST',
				`/api/v1/ims/order/${orderId}/orderProduct`,
				newItem,
			);
		} catch (e) {
			if (e instanceof Error) {
				console.log(e.toString());
			} else if (e instanceof AxiosError) {
				console.log(e.response?.data as string);
			} else {
				console.log('An unknown error occured');
			}
		} finally {
			set({loading: false});
		}
	},
	removeOrderItem: async (orderId: number, itemId: number) => {
		set({loading: true});
		try {
			await request(
				'DELETE',
				`/api/v1/ims/order/${orderId}/orderProduct/${itemId}`,
			);
		} catch (e) {
			if (e instanceof Error) {
				console.log(e.toString());
			} else if (e instanceof AxiosError) {
				console.log(e.response?.data as string);
			} else {
				console.log('An unknown error occured');
			}
		} finally {
			set({loading: false});
		}
	},
}));

export default useOrderStore;
