import {Joborder} from '@/components/validation/joborder';
import {create} from 'zustand';

type JoborderStore = {
	data: Joborder | null;
	setJoborder: (newData: Joborder) => void;
	resetJoborder: () => void;
};

const useJoborderStore = create<JoborderStore>((set) => ({
	data: null,
	setJoborder: (newData) =>
		set(() => ({
			data: newData,
		})),
	resetJoborder: () => set({data: null}),
}));

export default useJoborderStore;
