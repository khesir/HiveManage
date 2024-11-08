import {EmployeeBasicInformation} from '@/modules/ems/_components/validation/employee-zod-schema';
import {create} from 'zustand';

interface EmployeeStore {
	selectedEmployee: EmployeeBasicInformation | null;
	setSelectedEmployee: (employee: EmployeeBasicInformation | null) => void;
}

export const useEmployeeStore = create<EmployeeStore>((set) => ({
	selectedEmployee: null,
	setSelectedEmployee: (employee) => set({selectedEmployee: employee}),
}));
