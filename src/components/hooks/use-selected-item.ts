import {ItemWithDetails} from '@/lib/inventory-zod-schema';
import {create} from 'zustand';

interface ItemWithDetailsStore {
	selectedItemWithDetails: ItemWithDetails[];
	setSelectedItemWithDetails: (items: ItemWithDetails[]) => void;
	addItemWithDetails: (item: ItemWithDetails) => void;
	removeItemWithDetails: (id: number) => void;
}

export const useItemWithDetailsStore = create<ItemWithDetailsStore>((set) => ({
	selectedItemWithDetails: [],
	setSelectedItemWithDetails: (data) => set({selectedItemWithDetails: data}),
	addItemWithDetails: (item) =>
		set((state) => ({
			selectedItemWithDetails: [...state.selectedItemWithDetails, item], // Add a new item to the array
		})),
	removeItemWithDetails: (id) =>
		set((state) => ({
			selectedItemWithDetails: state.selectedItemWithDetails.filter(
				(item) => item.item_id !== id, // Remove an item from the array by its id
			),
		})),
}));
