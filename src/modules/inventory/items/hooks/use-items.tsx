import {ItemWithDetails} from '@/modules/inventory/_components/validation/product';
import {create} from 'zustand';

type ItemsWithDetailsProps = {
	data: ItemWithDetails | null;
	setItemsWithDetals: (newData: Partial<ItemWithDetails>) => void;
	resetItemsWithDetals: () => void;
};

const useItemsWithDetailsStore = create<ItemsWithDetailsProps>((set) => ({
	data: null,
	setItemsWithDetals: (newData) =>
		set((state) => ({
			data: {...(state.data ?? {}), ...newData} as ItemWithDetails,
		})),
	resetItemsWithDetals: () => set({data: null}),
}));

export default useItemsWithDetailsStore;
