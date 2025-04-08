import {Payment} from '@/components/validation/payment';
import {create} from 'zustand';
type PaymentFormStore = {
	data: Payment | null;
	setPaymentFormData: (newData: Payment) => void;
	resetPaymentFormData: () => void;
};

const usePaymentFormStore = create<PaymentFormStore>((set) => ({
	data: null,
	setPaymentFormData: (newData) =>
		set(() => ({
			data: newData,
		})),
	resetPaymentFormData: () => set({data: null}),
}));

export default usePaymentFormStore;
