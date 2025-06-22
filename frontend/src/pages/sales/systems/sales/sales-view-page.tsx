import {ContentLayout} from '@/components/appLayout/content-layout';

import {Breadcrumbs} from '@/components/ui/breadcrumbs';
import ViewSales from '@/modules/sales/_sections/sales/sales-view';

const breadcrubItems = [
	{title: 'Dashboard', link: '/sales/dashboard'},
	{title: 'Systems', link: '/sales/overview'},
	{title: 'List', link: '/sales/overview'},
	{title: 'View', link: '/sales/view'},
];

export default function SalesViewPage() {
	return (
		<ContentLayout title="PC BEE Management Systems">
			<Breadcrumbs items={breadcrubItems} />
			<ViewSales />
		</ContentLayout>
	);
}
