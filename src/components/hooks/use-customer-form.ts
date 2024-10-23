import {Customer} from '@/lib/cms-zod-schema';
import {create} from 'zustand';

type CustomerFormStore = {
	data: Customer | null;
	setCustomerFormData: (newData: Partial<Customer>) => void;
};

const useCustomerFormStore = create<CustomerFormStore>((set) => ({
	data: null,
	setCustomerFormData: (newData) =>
		set((state) => ({
			data: {...(state.data ?? {}), ...newData} as Customer,
		})),
}));

export default useCustomerFormStore;
