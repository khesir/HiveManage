import {create} from 'zustand';
import {Mail, mails} from './data';

type Config = {
	selected: Mail['id'] | null;
	setSelected: (id: Mail['id']) => void;
};

const useMailStore = create<Config>((set) => ({
	selected: mails[0].id,
	setSelected: (id) => set({selected: id}),
}));

// Custom hook to use the store
export function useMail() {
	return useMailStore((state) => ({
		selected: state.selected,
		setSelected: state.setSelected,
	}));
}
