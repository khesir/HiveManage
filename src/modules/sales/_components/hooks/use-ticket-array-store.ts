import {create} from 'zustand';
import {TaskWithDetails} from '../validation/task';

type TicketStore = {
	seledtedTickets: TaskWithDetails[];
	setTicketStoreWithDetails: (newData: TaskWithDetails[]) => void;
	addTicketStoreWithDetails: (item: TaskWithDetails) => void;
	removeTicketStoreWithDetails: (id: number) => void;
};

const useTicketArrayStore = create<TicketStore>((set) => ({
	seledtedTickets: [],
	setTicketStoreWithDetails: (data) =>
		set({seledtedTickets: data as TaskWithDetails[]}),
	addTicketStoreWithDetails: (ticket) =>
		set((state) => ({
			seledtedTickets: [...state.seledtedTickets, ticket],
		})),
	removeTicketStoreWithDetails: (id) =>
		set((state) => ({
			seledtedTickets: state.seledtedTickets.filter(
				(ticket) => ticket.remark_id !== id,
			),
		})),
}));

export default useTicketArrayStore;
