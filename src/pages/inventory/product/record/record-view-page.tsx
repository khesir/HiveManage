import {ContentLayout} from '@/components/appLayout/content-layout';
import {Breadcrumbs} from '@/components/ui/breadcrumbs';
import ItemRecordSection from '@/modules/inventory/_section/record/view-item-record';

const breadcrubItems = [
	{title: 'Dashboard', link: 'admin/dashboard'},
	{title: 'Systems', link: 'admin/inventory/products'},
	{title: 'Inventory', link: 'admin/inventory/products'},
	{title: 'Products', link: 'admin/inventory/products'},
	{title: 'View', link: 'admin/inventory/products'},
	{title: 'Record', link: 'admin/inventory/products'},
];

export default function RecordViewPage() {
	return (
		<ContentLayout title={'PC BEE Management Systems'}>
			<Breadcrumbs items={breadcrubItems} />
			<ItemRecordSection />
		</ContentLayout>
	);
}
