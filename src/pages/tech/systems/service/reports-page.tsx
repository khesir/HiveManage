import {ContentLayout} from '@/components/layout/content-layout';
import {Breadcrumbs} from '@/components/ui/breadcrumbs';

const breadcrubItems = [
	{title: 'Dashboard', link: '/tech/dashboard'},
	{title: 'Systems', link: '/tech/overview'},
	{title: 'Overview', link: '/tech/overview'},
	{title: 'Joborders', link: '/tech/services/joborders'},
	{title: 'Reports', link: '/tech/services/joborders'},
];

export default function ReportsPage() {
	return (
		<ContentLayout title="PC BEE Management Systems">
			<Breadcrumbs items={breadcrubItems} />
			<p>Reports Table</p>
		</ContentLayout>
	);
}
