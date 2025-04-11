import {ContentLayout} from '@/components/appLayout/content-layout';
import {Breadcrumbs} from '@/components/ui/breadcrumbs';
import {CreateServiceSection} from '@/modules/sales/_sections/service/service-create-section';

const breadcrubItems = [
	{title: 'Dashboard', link: 'sales/dashboard'},
	{title: 'Systems', link: 'sales/overview'},
	{title: 'Overview', link: 'sales/overview'},
	{title: 'Services', link: 'sales/services'},
	{title: 'Create', link: '#'},
];

export default function CreateServicePage() {
	return (
		<ContentLayout title="PC BEE Management Systems">
			<Breadcrumbs items={breadcrubItems} />
			<CreateServiceSection />
		</ContentLayout>
	);
}
