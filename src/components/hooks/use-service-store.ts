import {ServiceWithDetails} from '@/lib/sales-zod-schema';
import {create} from 'zustand';

type ServiceFormStory = {
	data: ServiceWithDetails | null;
	setServiceFormData: (newData: Partial<ServiceWithDetails>) => void;
	resetServiceFormData: () => void;
};

const useServiceFormStore = create<ServiceFormStory>((set) => ({
	data: null,
	setServiceFormData: (newData) =>
		set((state) => ({
			data: {...(state.data ?? {}), ...newData} as ServiceWithDetails,
		})),
	resetServiceFormData: () => set({data: null}),
}));

export default useServiceFormStore;
