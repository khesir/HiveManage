import {ContentLayout} from '@/components/appLayout/content-layout';
import {Breadcrumbs} from '@/components/ui/breadcrumbs';
import CreateOrderSection from '@/modules/inventory/_section/order/create-order';

const breadcrubItems = [
	{title: 'Dashboard', link: 'admin/dashboard'},
	{title: 'Systems', link: 'admin/inventory/products'},
	{title: 'Inventory', link: 'admin/inventory/products'},
	{title: 'Orders', link: 'admin/inventory/products/orders'},
	{title: 'Create', link: 'admin/inventory/products/orders/create'},
];

export default function CreateOrderPage() {
	return (
		<ContentLayout title={'PC BEE Management Systems'}>
			<Breadcrumbs items={breadcrubItems} />
			<CreateOrderSection />
		</ContentLayout>
	);
}
