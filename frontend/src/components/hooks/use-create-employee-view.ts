import {EmployeeFormSchema} from '@/modules/ems/_components/validation/custom-validation'; // Import your schema
import {create} from 'zustand';

type EmployeeFormStore = {
	data: EmployeeFormSchema | null;
	setEmployeeFormData: (newData: Partial<EmployeeFormSchema>) => void;
};

const useEmployeeFormStore = create<EmployeeFormStore>((set) => ({
	data: null,
	setEmployeeFormData: (newData) =>
		set((state) => ({
			data: {...(state.data ?? {}), ...newData} as EmployeeFormSchema,
		})),
}));

export default useEmployeeFormStore;
