import {ContentLayout} from '@/components/appLayout/content-layout';
import {Breadcrumbs} from '@/components/ui/breadcrumbs';
import CreateSupplierSection from '@/modules/inventory/_section/supplier/create-supplier-section';

const breadcrubItems = [
	{title: 'Dashboard', link: 'admin/dashboard'},
	{title: 'Systems', link: 'admin/inventory/products'},
	{title: 'Inventory', link: 'admin/inventory/products'},
	{title: 'Supplier', link: 'admin/inventory/products/supplier'},
];

export default function CreateSupplierPage() {
	return (
		<ContentLayout title={'PC BEE Management Systems'}>
			<Breadcrumbs items={breadcrubItems} />
			<CreateSupplierSection />
		</ContentLayout>
	);
}
