import {ContentLayout} from '@/components/appLayout/content-layout';

import {Breadcrumbs} from '@/components/ui/breadcrumbs';
import ServiceListSection from '@/modules/sales/_sections/service/joborder-view-service-list';

const breadcrubItems = [
	{title: 'Dashboard', link: '/sales/dashboard'},
	{title: 'Systems', link: '/sales/overview'},
	{title: 'Joborder', link: '/sales/services'},
	{title: 'Services', link: '/sales/services'},
];

export default function ServiceListPage() {
	return (
		<ContentLayout title="PC BEE Management Systems">
			<Breadcrumbs items={breadcrubItems} />
			<ServiceListSection />
		</ContentLayout>
	);
}
