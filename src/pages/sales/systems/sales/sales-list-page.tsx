import {ContentLayout} from '@/components/appLayout/content-layout';

import {Breadcrumbs} from '@/components/ui/breadcrumbs';
import SalesListSection from '@/modules/sales/_sections/sales/sales-list';

const breadcrubItems = [
	{title: 'Dashboard', link: '/sales/dashboard'},
	{title: 'Systems', link: '/sales/overview'},
	{title: 'Sales', link: '/sales/list'},
];

export default function SalesListPage() {
	return (
		<ContentLayout title="PC BEE Management Systems">
			<Breadcrumbs items={breadcrubItems} />
			<SalesListSection />
		</ContentLayout>
	);
}
