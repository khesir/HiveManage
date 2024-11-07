import {ContentLayout} from '@/components/appLayout/content-layout';

import {Breadcrumbs} from '@/components/ui/breadcrumbs';
import TechOverviewSection from '@/modules/sales/_sections/overview/tech/tech-overview-section';

const breadcrubItems = [
	{title: 'Dashboard', link: '/tech/dashboard'},
	{title: 'Systems', link: '/tech/overview'},
	{title: 'Overview', link: '/tech/overview'},
	{title: 'Assign Joborders', link: '/tech/assigned-services'},
];

export default function TechOverview() {
	return (
		<ContentLayout title="PC BEE Management Systems">
			<Breadcrumbs items={breadcrubItems} />
			<TechOverviewSection />
		</ContentLayout>
	);
}
