import {ItemWithDetails} from '@/lib/inventory-zod-schema';
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
