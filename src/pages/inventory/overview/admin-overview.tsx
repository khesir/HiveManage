import {ContentLayout} from '@/components/appLayout/content-layout';
import {Breadcrumbs} from '@/components/ui/breadcrumbs';
import InventorySection from '@/modules/inventory/_section/overview/overview-content';

const breadcrubItems = [{title: 'Dashboard', link: 'admin/dashboard'}];

export default function InventoryOverview() {
	return (
		<ContentLayout title={'PC BEE Management Systems'}>
			<Breadcrumbs items={breadcrubItems} />
			<InventorySection />
		</ContentLayout>
	);
}
