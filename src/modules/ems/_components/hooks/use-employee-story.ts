import {create} from 'zustand';
import {EmployeeRolesWithDetails} from '../validation/employeeRoles';

interface EmployeeStore {
	selectedEmployee: EmployeeRolesWithDetails | null;
	setSelectedEmployee: (employee: EmployeeRolesWithDetails | null) => void;
}

export const useEmployeeStore = create<EmployeeStore>((set) => ({
	selectedEmployee: null,
	setSelectedEmployee: (employee) => set({selectedEmployee: employee}),
}));
