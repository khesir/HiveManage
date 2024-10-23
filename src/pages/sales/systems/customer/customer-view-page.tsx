import {ContentLayout} from '@/components/layout/content-layout';

import {Breadcrumbs} from '@/components/ui/breadcrumbs';
import CustomerViewSection from '@/modules/sales/_sections/customer/customer-view';

const breadcrubItems = [
	{title: 'Dashboard', link: 'sales/dashboard'},
	{title: 'Systems', link: 'sales/overview'},
	{title: 'Overview', link: 'sales/overview'},
	{title: 'Customer', link: 'sales/customer'},
	{title: 'View', link: '#'},
];

export default function CustomerViewPage() {
	return (
		<ContentLayout title="PC BEE Management Systems">
			<Breadcrumbs items={breadcrubItems} />
			<CustomerViewSection />
		</ContentLayout>
	);
}
