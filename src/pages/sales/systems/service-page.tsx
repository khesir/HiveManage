import {ContentLayout} from '@/components/appLayout/content-layout';

import {Breadcrumbs} from '@/components/ui/breadcrumbs';
import ServiceListSection from '@/modules/sales/_sections/sales/service-list-view';

const breadcrubItems = [
	{title: 'Dashboard', link: 'sales/dashboard'},
	{title: 'Systems', link: 'sales/overview'},
	{title: 'Overview', link: 'sales/overview'},
	{title: 'Services', link: 'sales/services'},
];
export default function ServicePages() {
	return (
		<ContentLayout title="PC BEE Management Systems">
			<Breadcrumbs items={breadcrubItems} />
			<ServiceListSection />
		</ContentLayout>
	);
}
