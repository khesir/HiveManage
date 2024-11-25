import {ContentLayout} from '@/components/appLayout/content-layout';
import {Breadcrumbs} from '@/components/ui/breadcrumbs';
import CreateInventoryRecordSection from '@/modules/inventory/_section/product/create-inventory-record';

const breadcrubItems = [
	{title: 'Dashboard', link: 'admin/dashboard'},
	{title: 'Systems', link: 'admin/inventory/products'},
	{title: 'Inventory', link: 'admin/inventory/products'},
	{title: 'Products', link: 'admin/inventory/products'},
	{title: 'Records', link: 'admin/inventory/products'},
	{title: 'Create', link: 'admin/inventory/products'},
];

export default function InventoryRecordCreatePage() {
	return (
		<ContentLayout title={'PC BEE Management Systems'}>
			<Breadcrumbs items={breadcrubItems} />
			<CreateInventoryRecordSection />
		</ContentLayout>
	);
}
