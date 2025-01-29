import {create} from 'zustand';
import {TaskWithDetails} from '../../../joborder/_components/validation/task';

type TicketStore = {
	data: TaskWithDetails | null;
	setTicketStore: (newData: Partial<TaskWithDetails>) => void;
	resetTicketStore: () => void;
};

const useTicketStore = create<TicketStore>((set) => ({
	data: null,
	setTicketStore: (newData) =>
		set((state) => ({
			data: {...(state.data ?? {}), ...newData} as TaskWithDetails,
		})),
	resetTicketStore: () => set({data: null}),
}));

export default useTicketStore;
