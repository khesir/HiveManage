import {create} from 'zustand';

type Titlestore = {
	title: string;
	setTitle: (title: string) => void;
};

const useHeaderTitle = create<Titlestore>((set) => ({
	title: '', // Initial status
	setTitle: (title: string) => set({title}), // Update status
}));

export default useHeaderTitle;
