import {RemarkTicketWithDetails} from '@/lib/sales-zod-schema';
import {create} from 'zustand';

interface RemarkTickets {
	selecetedRemarkTickets: RemarkTicketWithDetails | null;
	setRemarkTickets: (remarkTickets: RemarkTicketWithDetails) => void;
}

export const useRemarksTicket = create<RemarkTickets>((set) => ({
	selecetedRemarkTickets: null,
	setRemarkTickets: (remarkTickets) =>
		set({selecetedRemarkTickets: remarkTickets}),
}));
