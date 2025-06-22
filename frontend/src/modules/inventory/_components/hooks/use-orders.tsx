import {create} from 'zustand';
import {Order} from '../../../../components/validation/order';

type PropsProps = {
	data: Order | null;
	setOrder: (newData: Order) => void;
	resetOrder: () => void;
};

const useLoalOrderStore = create<PropsProps>((set) => ({
	data: null,
	setOrder: (newData: Order) =>
		set(() => ({
			data: newData,
		})),
	resetOrder: () =>
		set(() => ({
			data: null,
		})),
}));

export default useLoalOrderStore;
