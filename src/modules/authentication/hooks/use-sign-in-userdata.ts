import {EmployeeRolesWithDetails} from '@/lib/employee-custom-form-schema';
import {create} from 'zustand';

interface SignedInUser {
	user: EmployeeRolesWithDetails | null;
	setUser: (employee: EmployeeRolesWithDetails | null) => void;
}

export const useEmployeeRoleDetailsStore = create<SignedInUser>((set) => ({
	user: null,
	setUser: (employee) => set({user: employee}),
}));
