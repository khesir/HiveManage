import {Order} from '@/components/validation/inventory/order';
import {AxiosError} from 'axios';
import {create} from 'zustand';
import {ApiRequest, PaginationResponse, request} from './axios';
import {OrderProduct} from '@/components/validation/inventory/order-product';
import {toast} from 'sonner';

type OrderState = {
	orders: Order[];
	selectedOrder: Order;
	loading: boolean;
	fetchOrders: (params: URLSearchParams) => Promise<void>;
	getOrderById: (orderId: number) => Promise<Order | undefined>;
	addOrder: (newOrder: Omit<Order, 'id'>) => Promise<void>;
	updateOrder: (orderId: number, order: Order) => Promise<void>;
	deleteOrder: (orderId: number) => Promise<void>;
	addOrderItem: (orderId: number, newItem: OrderProduct) => void;
	updateOrderItem: (
		orderId: number,
		order_product_id: number,
		newItem: OrderProduct,
	) => void;
	removeOrderItem: (orderId: number, itemId: number) => void;
	finalize: (orderId: number, newItem: Order) => void;
	pushToInventory: (orderId: number, newItem: Order) => void;
};

const useOrderStore = create<OrderState>((set) => ({
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
					'&includes=order_products,supplier,product',
			);
			set({orders: response.data});
		} catch (e) {
			if (e instanceof Error) {
				toast.error(e.toString());
			} else if (e instanceof AxiosError) {
				toast.error(e.response?.data as string);
			} else {
				toast.error('An unknown error occured');
			}
			console.log(e);
		} finally {
			set({loading: false});
		}
	},
	getOrderById: async (orderId) => {
		set({loading: true});
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
			set({selectedOrder: orderData});
			return orderData;
		} catch (e) {
			if (e instanceof Error) {
				toast.error(e.toString());
			} else if (e instanceof AxiosError) {
				toast.error(e.response?.data as string);
			} else {
				toast.error('An unknown error occured');
			}
			console.log(e);
		} finally {
			set({loading: false});
		}
	},
	addOrder: async (newOrder: Order) => {
		set({loading: true});
		try {
			await request('POST', `api/v1/ims/order/`, {
				...newOrder,
				order_value: newOrder.order_value.toString(),
				supplier_id: Number(newOrder.supplier_id),
			});
			toast.success('Order Added');
		} catch (e) {
			if (e instanceof Error) {
				toast.error(e.toString());
			} else if (e instanceof AxiosError) {
				toast.error(e.response?.data as string);
			} else {
				toast.error('An unknown error occured');
			}
			console.log(e);
		} finally {
			set({loading: false});
		}
	},
	updateOrder: async (orderId: number, order: Order) => {
		set({loading: true});
		try {
			await request('PUT', `api/v1/ims/order/${orderId}`, {
				...order,
				order_value: order.order_value.toString(),
			});
			toast.success('Order Updated');
		} catch (e) {
			if (e instanceof Error) {
				toast.error(e.toString());
			} else if (e instanceof AxiosError) {
				toast.error(e.response?.data as string);
			} else {
				toast.error('An unknown error occured');
			}
			console.log(e);
		} finally {
			set({loading: false});
		}
	},
	deleteOrder: async (orderId) => {
		set({loading: true});
		try {
			await request('DELETE', `api/v1/ims/order/${orderId}`);
			toast.success('Order Deleted');
		} catch (e) {
			if (e instanceof Error) {
				toast.error(e.toString());
			} else if (e instanceof AxiosError) {
				toast.error(e.response?.data as string);
			} else {
				toast.error('An unknown error occured');
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
				toast.error(e.toString());
			} else if (e instanceof AxiosError) {
				toast.error(e.response?.data as string);
			} else {
				toast.error('An unknown error occured');
			}
		} finally {
			set({loading: false});
		}
	},
	updateOrderItem: async (
		orderId: number,
		order_product_id: number,
		newItem: OrderProduct,
	) => {
		set({loading: true});
		try {
			await request(
				'PUT',
				`/api/v1/ims/order/${orderId}/orderProduct/${order_product_id}`,
				newItem,
			);
			toast.success('Order Item Updated successfully');
		} catch (e) {
			if (e instanceof Error) {
				toast.error(e.toString());
			} else if (e instanceof AxiosError) {
				toast.error(e.response?.data as string);
			} else {
				toast.error('An unknown error occured');
			}
			console.log(e);
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
			toast.success('Order item removed');
		} catch (e) {
			if (e instanceof Error) {
				toast.error(e.toString());
			} else if (e instanceof AxiosError) {
				toast.error(e.response?.data as string);
			} else {
				toast.error('An unknown error occured');
			}
			console.log(e);
		} finally {
			set({loading: false});
		}
	},

	finalize: async (orderId: number, orderData: Order) => {
		set({loading: true});
		try {
			// Just a temporary solution, For some reason after fetching data that is undefined
			// Is replaced as null
			await request('POST', `/api/v1/ims/order/${orderId}/finalize`, orderData);
			toast.success('Order products has been updated');
		} catch (e) {
			if (e instanceof Error) {
				toast.error(e.toString());
			} else if (e instanceof AxiosError) {
				toast.error(e.response?.data as string);
			} else {
				toast.error('An unknown error occured');
			}
			console.log(e);
		} finally {
			set({loading: false});
		}
	},

	pushToInventory: async (orderId: number, orderData: Order) => {
		set({loading: true});
		try {
			// Just a temporary solution, For some reason after fetching data that is undefined
			// Is replaced as null
			await request(
				'POST',
				`/api/v1/ims/order/${orderId}/pushToInventory`,
				orderData,
			);
			toast.success('Order products has been added to records');
		} catch (e) {
			if (e instanceof Error) {
				toast.error(e.toString());
			} else if (e instanceof AxiosError) {
				toast.error(e.response?.data as string);
			} else {
				toast.error('An unknown error occured');
			}
			console.log(e);
		} finally {
			set({loading: false});
		}
	},
}));

export default useOrderStore;
