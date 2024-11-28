import {Item} from '@/modules/inventory/_components/validation/item';
import {create} from 'zustand';

type PropsProps = {
	data: Item | null;
	setSelectedItem: (newData: Item) => void;
	resetSelectedItem: () => void;
};

const useItemStore = create<PropsProps>((set) => ({
	data: null,
	setSelectedItem: (newData: Item) =>
		set(() => ({
			data: newData,
		})),
	resetSelectedItem: () =>
		set(() => ({
			data: null,
		})),
}));

export default useItemStore;
