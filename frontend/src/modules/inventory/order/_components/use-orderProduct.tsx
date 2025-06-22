import {OrderProduct} from '@/components/validation/order-product';
import {create} from 'zustand';

type PropsProps = {
	data: OrderProduct | null;
	setOrderProduct: (newData: OrderProduct) => void;
};

const useOrderProductStore = create<PropsProps>((set) => ({
	data: null,
	setOrderProduct: (newData: OrderProduct) =>
		set((state) => {
			const updatedData = {...state.data, ...newData};
			return {data: updatedData};
		}),
}));

export default useOrderProductStore;
