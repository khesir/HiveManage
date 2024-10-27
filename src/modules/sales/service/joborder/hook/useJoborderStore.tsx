import {JobOrderWithDetails} from '@/lib/sales-zod-schema';
import {create} from 'zustand';

type JoborderStore = {
	joborderData: JobOrderWithDetails | null;
	setJoborderData: (newData: JobOrderWithDetails) => void;
	resetJoborderData: () => void;
};

export const useJoborderStore = create<JoborderStore>((set) => ({
	joborderData: null,
	setJoborderData: (newData: JobOrderWithDetails) =>
		set({joborderData: newData}),
	resetJoborderData: () => set({joborderData: null}),
}));
