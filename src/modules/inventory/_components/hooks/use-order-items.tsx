import {create} from 'zustand';
import {OrderItem} from '../validation/order-item';

type PropsProps = {
	orderItem: OrderItem | null;
	setOrderItem: (newData: OrderItem) => void;
	resetOrderItem: () => void;
};

const useOrderItemStore = create<PropsProps>((set) => ({
	orderItem: null,
	setOrderItem: (newData: OrderItem) =>
		set(() => ({
			orderItem: newData,
		})),
	resetOrderItem: () =>
		set(() => ({
			orderItem: null,
		})),
}));

export default useOrderItemStore;
