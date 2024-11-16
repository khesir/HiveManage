import {ContentLayout} from '@/components/appLayout/content-layout';
import {Breadcrumbs} from '@/components/ui/breadcrumbs';

const breadcrubItems = [
	{title: 'Dashboard', link: 'admin/dashboard'},
	{title: 'Systems', link: 'admin/inventory/products'},
	{title: 'Inventory', link: 'admin/inventory/products'},
	{title: 'Products', link: 'admin/inventory/products'},
	{title: 'Orders', link: 'admin/inventory/products/orders'},
];

export default function OrderPage() {
	return (
		<ContentLayout title={'PC BEE Management Systems'}>
			<Breadcrumbs items={breadcrubItems} />
			<p>Order Page</p>
		</ContentLayout>
	);
}
