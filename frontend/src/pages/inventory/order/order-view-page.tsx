import {ContentLayout} from '@/components/appLayout/content-layout';
import {Breadcrumbs} from '@/components/ui/breadcrumbs';
import ViewOrderSection from '@/modules/inventory/_section/order/view-order';

const breadcrubItems = [
	{title: 'Dashboard', link: '/admin/dashboard'},
	{title: 'Systems', link: '/admin/inventory/products'},
	{title: 'Inventory', link: '/admin/inventory/products'},
	{title: 'Orders', link: '/admin/inventory/orders'},
	{title: 'View', link: '/admin/inventory/orders/view'},
];

export default function ViewOrderPage() {
	return (
		<ContentLayout title={'PC BEE Management Systems'}>
			<Breadcrumbs items={breadcrubItems} />
			<ViewOrderSection />
		</ContentLayout>
	);
}
