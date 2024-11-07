import {ContentLayout} from '@/components/appLayout/content-layout';
import {Breadcrumbs} from '@/components/ui/breadcrumbs';

const breadcrubItems = [
	{title: 'Dashboard', link: '/tech/dashboard'},
	{title: 'Systems', link: '/tech/overview'},
	{title: 'Overview', link: '/tech/overview'},
	{title: 'Joborders', link: '/tech/services/joborders'},
	{title: 'Tickets', link: '/tech/services/joborders'},
];

export default function TicketsPage() {
	return (
		<ContentLayout title="PC BEE Management Systems">
			<Breadcrumbs items={breadcrubItems} />
			<p>Tickets Table</p>
		</ContentLayout>
	);
}
