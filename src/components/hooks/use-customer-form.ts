import {Customer} from '@/lib/cms-zod-schema';
import {create} from 'zustand';

type CustomerFormStore = {
	data: Customer | null;
	setCustomerFormData: (newData: Partial<Customer>) => void;
	resetCustomerFormData: () => void;
};

const useCustomerFormStore = create<CustomerFormStore>((set) => ({
	data: null,
	setCustomerFormData: (newData) =>
		set((state) => ({
			data: {...(state.data ?? {}), ...newData} as Customer,
		})),
	resetCustomerFormData: () => set({data: null}),
}));

export default useCustomerFormStore;
