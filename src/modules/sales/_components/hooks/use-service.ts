import {Service} from '@/components/validation/service';
import {create} from 'zustand';

type ServiceProps = {
	data: Service | null;
	setService: (newData: Service) => void;
	resetService: () => void;
};

const useService = create<ServiceProps>((set) => ({
	data: null,
	setService: (newData: Service) =>
		set(() => ({
			data: newData,
		})),
	resetService: () => set({data: null}),
}));

export default useService;
