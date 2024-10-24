import {BorrrowCard} from './cards/borrow-card';
import {JobOrderCard} from './cards/joborder-card';
import {ReservationCard} from './cards/reservation-card';

export function SalesServiceAccordionListCard() {
	return (
		<div className="space-y-3">
			<JobOrderCard />
			<BorrrowCard />
			<ReservationCard />
		</div>
	);
}
