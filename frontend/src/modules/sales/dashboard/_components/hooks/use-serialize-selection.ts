import {create} from 'zustand';
import {SerializeItem} from '@/components/validation/serialize-items';

interface SelectedItemStore {
	selectedItems: SerializeItem[];
	setSelectedItems: (items: SerializeItem[]) => void;
	clearSelectedItems: () => void;
}

export const useSelectedItemsStore = create<SelectedItemStore>((set) => ({
	selectedItems: [],
	setSelectedItems: (items) => set({selectedItems: items}),
	clearSelectedItems: () => set({selectedItems: []}),
}));
