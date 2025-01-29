import {create} from 'zustand';
import {TaskWithDetails} from '../../../joborder/_components/validation/task';

type TaskStoreProps = {
	data: TaskWithDetails | null;
	setTaskStoreData: (newData: Partial<TaskWithDetails>) => void;
	resetTaskStoreData: () => void;
};

const useTaskStore = create<TaskStoreProps>((set) => ({
	data: null,
	setTaskStoreData: (newData) =>
		set((state) => ({
			data: {...(state.data ?? {}), ...newData} as TaskWithDetails,
		})),
	resetTaskStoreData: () => set({data: null}),
}));

export default useTaskStore;
