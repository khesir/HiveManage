import {create} from 'zustand';
import {Customer} from '../validation/customer';

type Props = {
	customer: Customer | null;
	setCustomer: (newData: Customer) => void;
	resetCustomer: () => void;
};

const useCustomer = create<Props>((set) => ({
	customer: null,
	setCustomer: (newData: Customer) =>
		set({
			customer: newData,
		}),
	resetCustomer: () => set({customer: null}),
}));

export default useCustomer;
