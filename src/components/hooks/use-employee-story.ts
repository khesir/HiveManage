import {Employee} from '@/components/types';
import {create} from 'zustand';

interface EmployeeStore {
	selectedEmployee: Employee | null;
	setSelectedEmployee: (employee: Employee | null) => void;
}

export const useEmployeeStore = create<EmployeeStore>((set) => ({
	selectedEmployee: null,
	setSelectedEmployee: (employee) => set({selectedEmployee: employee}),
}));
