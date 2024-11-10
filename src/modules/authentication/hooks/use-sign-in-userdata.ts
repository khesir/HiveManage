import {EmployeeRolesWithDetails} from '@/modules/ems/_components/validation/employeeRoles';
import {create} from 'zustand';
import {persist} from 'zustand/middleware';

interface SignedInUser {
	user: EmployeeRolesWithDetails | null;
	setUser: (employee: EmployeeRolesWithDetails | null) => void;
	clearUser: () => void;
}

export const useEmployeeRoleDetailsStore = create<SignedInUser>()(
	persist(
		(set) => ({
			user: null,
			setUser: (userData) => set({user: userData}),
			clearUser: () => set({user: null}),
		}),
		{
			name: 'user-storage',
			getStorage: () => localStorage,
		},
	),
);
