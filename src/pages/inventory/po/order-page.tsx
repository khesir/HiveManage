import {ContentLayout} from '@/components/appLayout/content-layout';
import {Breadcrumbs} from '@/components/ui/breadcrumbs';
import ItemSection from '@/modules/inventory/_section/items/items-section';

const breadcrubItems = [{title: 'Dashboard', link: 'admin/dashboard'}];

export default function OrderPage() {
	return (
		<ContentLayout title={'PC BEE Management Systems'}>
			<Breadcrumbs items={breadcrubItems} />
			<ItemSection />
		</ContentLayout>
	);
}
