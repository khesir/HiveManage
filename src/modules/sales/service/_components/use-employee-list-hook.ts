import {EmployeeWithRelatedDetails} from '@/modules/ems/_components/validation/employee';
import {create} from 'zustand';

interface EmployeeState {
	selectedEmployees: EmployeeWithRelatedDetails[];
	appendEmployee: (employee: EmployeeWithRelatedDetails) => void;
	resetEmployees: (employees: EmployeeWithRelatedDetails[]) => void;
	removeEmployeeById: (id: number) => void;
}

const useEmployeeStore = create<EmployeeState>((set) => ({
	selectedEmployees: [],
	appendEmployee: (employee) =>
		set((state) => ({
			selectedEmployees: state.selectedEmployees.some(
				(e) => e.employee.employee_id === employee.employee.employee_id,
			)
				? state.selectedEmployees
				: [...state.selectedEmployees, employee],
		})),
	resetEmployees: () =>
		set(() => ({
			selectedEmployees: [],
		})),
	removeEmployeeById: (id) =>
		set((state) => ({
			selectedEmployees: state.selectedEmployees.filter(
				(employee) => employee.employee.employee_id !== id,
			),
		})),
}));

export default useEmployeeStore;
