import {ContentLayout} from '@/components/appLayout/content-layout';

import {Breadcrumbs} from '@/components/ui/breadcrumbs';
import SalesPosSection from '@/modules/sales/_sections/sales/sales-pos-section';

const breadcrubItems = [
	{title: 'Dashboard', link: '/sales/dashboard'},
	{title: 'Systems', link: '/sales/overview'},
	{title: 'POS', link: '/sales/overview'},
];

export default function SalesPosPage() {
	return (
		<ContentLayout title="PC BEE Management Systems">
			<Breadcrumbs items={breadcrubItems} />
			<SalesPosSection />
		</ContentLayout>
	);
}
