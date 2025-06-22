import {ContentLayout} from '@/components/appLayout/content-layout';
import {Breadcrumbs} from '@/components/ui/breadcrumbs';
import InventorySection from '@/modules/inventory/_section/product/overview-content';

const breadcrubItems = [
	{title: 'Dashboard', link: 'admin/dashboard'},
	{title: 'Systems', link: 'admin/inventory/products'},
	{title: 'Inventory', link: 'admin/inventory/products'},
	{title: 'Products', link: 'admin/inventory/products'},
];

export default function ProductPage() {
	return (
		<ContentLayout title={'PC BEE Management Systems'}>
			<Breadcrumbs items={breadcrubItems} />
			<InventorySection />
		</ContentLayout>
	);
}
