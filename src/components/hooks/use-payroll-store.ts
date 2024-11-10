import {Payroll} from '@/modules/ems/_components/validation/employee';
import {create} from 'zustand';

interface PayrollStore {
	selectedPayroll: Payroll | null;
	setSelectedPayroll: (payroll: Payroll | null) => void;
}

export const usePayrollStore = create<PayrollStore>((set) => ({
	selectedPayroll: null,
	setSelectedPayroll: (payroll) => set({selectedPayroll: payroll}),
}));
