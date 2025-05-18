import {Heading} from '@/components/ui/heading';
import {TicketForm} from '../../service/view/serviceDetails/ticket-form';

export function CreateServiceTicketSection() {
	return (
		<div className="flex flex-col gap-4">
			<div className="p-4 sm:px-6 space-y-5">
				<Heading title={`Create Ticket`} description="" />
				<TicketForm />
			</div>
		</div>
	);
}
