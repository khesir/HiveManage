import {ContentLayout} from '@/components/appLayout/content-layout';

import {Breadcrumbs} from '@/components/ui/breadcrumbs';
import JoborderListSection from '@/modules/sales/_sections/service/joborder-list-section';

const breadcrubItems = [
	{title: 'Dashboard', link: '/sales/dashboard'},
	{title: 'Systems', link: '/sales/overview'},
	{title: 'Joborder', link: '/sales/services'},
];

export default function JoborderListPage() {
	return (
		<ContentLayout title="PC BEE Management Systems">
			<Breadcrumbs items={breadcrubItems} />
			<JoborderListSection />
		</ContentLayout>
	);
}
