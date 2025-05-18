import {ContentLayout} from '@/components/appLayout/content-layout';
import {Breadcrumbs} from '@/components/ui/breadcrumbs';
import {CreateJoborderSection} from '@/modules/sales/_sections/service/joborder-create-section';

const breadcrubItems = [
	{title: 'Dashboard', link: 'sales/dashboard'},
	{title: 'Systems', link: 'sales/overview'},
	{title: 'Joborder', link: '/sales/services'},
	{title: 'Create', link: '/sales/services'},
];

export default function CreateJoborderPage() {
	return (
		<ContentLayout title="PC BEE Management Systems">
			<Breadcrumbs items={breadcrubItems} />
			<CreateJoborderSection />
		</ContentLayout>
	);
}
