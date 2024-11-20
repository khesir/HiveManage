import {create} from 'zustand';
import {OrderWithDetails} from '../validation/order';

type PropsProps = {
	data: OrderWithDetails | null;
	setOrder: (newData: OrderWithDetails) => void;
	resetOrder: () => void;
};

const useOrderStore = create<PropsProps>((set) => ({
	data: null,
	setOrder: (newData: OrderWithDetails) =>
		set((state) => {
			const updatedData = {...state.data, ...newData};

			// If categories are not provided in the new data, reset them
			if (!newData.supplier?.categories) {
				if (updatedData.supplier) {
					updatedData.supplier.categories = [];
				}
			}

			return {data: updatedData};
		}),
	resetOrder: () =>
		set(() => ({
			data: null,
		})),
}));

export default useOrderStore;
