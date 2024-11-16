import {ContentLayout} from '@/components/appLayout/content-layout';
import {Breadcrumbs} from '@/components/ui/breadcrumbs';

const breadcrubItems = [
	{title: 'Dashboard', link: 'admin/dashboard'},
	{title: 'Systems', link: 'admin/inventory/products'},
	{title: 'Inventory', link: 'admin/inventory/products'},
	{title: 'Products', link: 'admin/inventory/products'},
	{title: 'Supplier', link: 'admin/inventory/products/supplier'},
];

export default function SupplierPage() {
	return (
		<ContentLayout title={'PC BEE Management Systems'}>
			<Breadcrumbs items={breadcrubItems} />
			<p>Supplier page</p>
		</ContentLayout>
	);
}
