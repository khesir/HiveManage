import {ContentLayout} from '@/components/appLayout/content-layout';

import {Breadcrumbs} from '@/components/ui/breadcrumbs';
import ViewService from '@/modules/sales/_sections/service/service-view';

const breadcrubItems = [
	{title: 'Dashboard', link: 'sales/dashboard'},
	{title: 'Systems', link: 'sales/overview'},
	{title: 'Joborder', link: 'sales/overview'},
	{title: 'Services', link: 'sales/services'},
	{title: 'View', link: '#'},
];
export default function ViewServicePage() {
	return (
		<ContentLayout title="PC BEE Management Systems">
			<Breadcrumbs items={breadcrubItems} />
			<ViewService />
		</ContentLayout>
	);
}
