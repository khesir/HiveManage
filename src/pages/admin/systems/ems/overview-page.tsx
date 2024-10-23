import {ContentLayout} from '@/components/layout/content-layout';
import {Breadcrumbs} from '@/components/ui/breadcrumbs';
import {AdminOverviewSection} from '@/modules/ems/_sections/employee/overview-admin-section';

const breadcrubItems = [
	{title: 'Dashboard', link: 'admin/dashboard'},
	{title: 'Employee Mangement System', link: 'admin/ems/overview'},
	{title: 'Overview', link: 'admin/ems/overview'},
];

export default function EmployeeOverviewPage() {
	return (
		<ContentLayout title={'Employee Mangament System'}>
			<Breadcrumbs items={breadcrubItems} />
			<AdminOverviewSection />
		</ContentLayout>
	);
}
