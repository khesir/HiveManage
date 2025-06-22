import {Service} from '@/components/validation/service';
import {create} from 'zustand';

type ServiceFormStore = {
	data: Service | null;
	setServiceFormData: (newData: Service) => void;
	resetServiceFormData: () => void;
};

const useServiceFormStore = create<ServiceFormStore>((set) => ({
	data: null,
	setServiceFormData: (newData) =>
		set(() => ({
			data: newData,
		})),
	resetServiceFormData: () => set({data: null}),
}));

export default useServiceFormStore;
