import {ContentLayout} from '@/components/appLayout/content-layout';
import {Breadcrumbs} from '@/components/ui/breadcrumbs';
import ServiceMenuSection from '@/modules/sales/_sections/service/service-menu-section';

const breadcrubItems = [
	{title: 'Dashboard', link: 'sales/dashboard'},
	{title: 'Systems', link: 'sales/overview'},
	{title: 'Overview', link: 'sales/overview'},
	{title: 'Services', link: 'sales/services'},
	{title: 'Menu', link: '#'},
];

export default function ServiceMenuPage() {
	return (
		<ContentLayout title="PC BEE Management Systems">
			<Breadcrumbs items={breadcrubItems} />
			<ServiceMenuSection />
		</ContentLayout>
	);
}
