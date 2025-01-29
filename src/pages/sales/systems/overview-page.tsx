import {ContentLayout} from '@/components/appLayout/content-layout';

import {Breadcrumbs} from '@/components/ui/breadcrumbs';
import SalesOveriewSection from '@/modules/sales/_sections/sales-overview-section';

const breadcrubItems = [
	{title: 'Dashboard', link: '/sales/dashboard'},
	{title: 'Systems', link: '/sales/overview'},
	{title: 'Overview', link: '/sales/overview'},
];

export default function OverviewPage() {
	return (
		<ContentLayout title="PC BEE Management Systems">
			<Breadcrumbs items={breadcrubItems} />
			<SalesOveriewSection />
		</ContentLayout>
	);
}
