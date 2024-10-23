import {ContentLayout} from '@/components/layout/content-layout';

import {Breadcrumbs} from '@/components/ui/breadcrumbs';
import SalesOveriewSection from '@/modules/sales/_sections/overview/sales-overview-section';

const breadcrubItems = [
	{title: 'Dashboard', link: 'sales/dashboard'},
	{title: 'Systems', link: 'sales/overview'},
	{title: 'Overview', link: 'sales/overview'},
];

export default function OverviewPage() {
	console.log('test');
	return (
		<ContentLayout title="PC BEE Management Systems">
			<Breadcrumbs items={breadcrubItems} />
			<SalesOveriewSection />
		</ContentLayout>
	);
}
