import {ContentLayout} from '@/components/appLayout/content-layout';

import {Breadcrumbs} from '@/components/ui/breadcrumbs';
import CustomerListView from '@/modules/customer/_section/customer-list-view';

const breadcrubItems = [
	{title: 'Dashboard', link: 'sales/dashboard'},
	{title: 'Systems', link: 'sales/overview'},
	{title: 'Overview', link: 'sales/overview'},
	{title: 'Customer', link: 'sales/customer'},
];
export default function CustomerDatabasePage() {
	return (
		<ContentLayout title="PC BEE Management Systems">
			<Breadcrumbs items={breadcrubItems} />
			<CustomerListView />
		</ContentLayout>
	);
}
