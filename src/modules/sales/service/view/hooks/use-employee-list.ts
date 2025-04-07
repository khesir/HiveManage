import {EmployeeBasicInformation} from '@/modules/ems/_components/validation/employee';
import {create} from 'zustand';

interface EmployeesStore {
	selectedEmployee: EmployeeBasicInformation[];
	setSelectedEmployee: (employee: EmployeeBasicInformation[]) => void;
	addEmployee: (employee: EmployeeBasicInformation) => void;
	removeEmployee: (id: number) => void;
	resetEmployee: () => void;
}

export const useEmployeeStore = create<EmployeesStore>((set) => ({
	selectedEmployee: [],
	setSelectedEmployee: (employee: EmployeeBasicInformation[]) =>
		set({selectedEmployee: employee}),
	addEmployee: (employee: EmployeeBasicInformation) =>
		set((state) => ({
			selectedEmployee: [...state.selectedEmployee, employee],
		})),
	removeEmployee: (id: number) =>
		set((state) => ({
			selectedEmployee: state.selectedEmployee.filter(
				(employee: EmployeeBasicInformation) => employee.employee_id !== id,
			),
		})),
	resetEmployee: () => set({selectedEmployee: []}),
}));
