import {Supplier} from '@/components/validation/supplier';
import {create} from 'zustand';

type PropsProps = {
	data: Supplier | null;
	setSupplier: (newData: Supplier) => void;
	resetSupplier: () => void;
};

const useSupplier = create<PropsProps>((set) => ({
	data: null,
	setSupplier: (newData: Supplier) =>
		set(() => ({
			data: newData,
		})),
	resetSupplier: () =>
		set(() => ({
			data: null,
		})),
}));

export default useSupplier;
