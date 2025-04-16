import {ContentLayout} from '@/components/appLayout/content-layout';
import {Breadcrumbs} from '@/components/ui/breadcrumbs';
import {CreateServiceTicketSection} from '@/modules/sales/_sections/service/service-ticket-create-section';

const breadcrubItems = [
	{title: 'Dashboard', link: 'sales/dashboard'},
	{title: 'Systems', link: 'sales/overview'},
	{title: 'Overview', link: 'sales/overview'},
	{title: 'Services', link: 'sales/services'},
	{title: 'View', link: 'sales/services/view'},
	{title: 'Tickets', link: 'sales/services/tickets'},
	{title: 'Create', link: 'sales/services/tickets/create'},
];

export default function CreateTaskPage() {
	return (
		<ContentLayout title="PC BEE Management Systems">
			<Breadcrumbs items={breadcrubItems} />
			<CreateServiceTicketSection />
		</ContentLayout>
	);
}
