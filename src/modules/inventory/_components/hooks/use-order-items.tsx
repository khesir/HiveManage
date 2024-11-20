import {create} from 'zustand';
import {OrderItemWithDetails} from '../validation/order';

type PropsProps = {
	orderItem: OrderItemWithDetails | null;
	setOrderItem: (newData: OrderItemWithDetails) => void;
	resetOrderItem: () => void;
};

const useOrderItemStore = create<PropsProps>((set) => ({
	orderItem: null,
	setOrderItem: (newData: OrderItemWithDetails) =>
		set((state) => ({
			orderItem: {...state.orderItem, ...newData},
		})),
	resetOrderItem: () =>
		set(() => ({
			orderItem: null,
		})),
}));

export default useOrderItemStore;
