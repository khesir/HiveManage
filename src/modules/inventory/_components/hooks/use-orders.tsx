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
		set(() => ({
			data: newData,
		})),
	resetOrder: () =>
		set(() => ({
			data: null,
		})),
}));

export default useOrderStore;
