import {ContentLayout} from '@/components/layout/content-layout';
import {Breadcrumbs} from '@/components/ui/breadcrumbs';
import JoborderSection from '@/modules/sales/_sections/service/joborder-section';

const breadcrubItems = [
	{title: 'Dashboard', link: '/tech/dashboard'},
	{title: 'Systems', link: '/tech/overview'},
	{title: 'Overview', link: '/tech/overview'},
	{title: 'Joborders', link: '/tech/services/joborders'},
];

export default function JoborderListsPage() {
	return (
		<ContentLayout title="PC BEE Management Systems">
			<Breadcrumbs items={breadcrubItems} />
			<JoborderSection />
		</ContentLayout>
	);
}
