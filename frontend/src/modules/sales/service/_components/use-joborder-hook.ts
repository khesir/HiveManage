import {Joborder} from '@/components/validation/joborder';
import {create} from 'zustand';

type JoborderStore = {
	joborderData: Joborder | null;
	setJoborder: (newData: Joborder) => void;
	resetJoborder: () => void;
};

const useJoborderStore = create<JoborderStore>((set) => ({
	joborderData: null,
	setJoborder: (newData) =>
		set(() => ({
			joborderData: newData,
		})),
	resetJoborder: () => set({joborderData: null}),
}));

export default useJoborderStore;
