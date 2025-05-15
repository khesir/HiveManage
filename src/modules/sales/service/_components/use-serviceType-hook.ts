import {ServiceType} from '@/components/validation/service-type';
import {create} from 'zustand';

type ServiceTypeStore = {
	data: ServiceType | null;
	setServiceType: (newData: ServiceType) => void;
	resetServiceType: () => void;
};

const useServiceTypeStore = create<ServiceTypeStore>((set) => ({
	data: null,
	setServiceType: (newData) =>
		set(() => ({
			data: newData,
		})),
	resetServiceType: () => set({data: null}),
}));

export default useServiceTypeStore;
