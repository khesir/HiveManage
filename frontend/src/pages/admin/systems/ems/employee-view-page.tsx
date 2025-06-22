import {ContentLayout} from '@/components/appLayout/content-layout';
import {Breadcrumbs} from '@/components/ui/breadcrumbs';
import EmployeeViewSection from '@/modules/ems/_sections/employee/view-employee-section';

// This is the Dashboard Page for Employee Management System (EMS)
const breadcrubItems = [
	{title: 'Dashboard', link: 'admin/dashboard'},
	{title: 'Employee Mangement System', link: '/admin/ems/overview'},
	{title: 'Employees', link: '/admin/ems/employees'},
	{title: 'View', link: '/admin/ems/employees/view'},
];

export default function EmployeeViewPage() {
	return (
		<ContentLayout title="Employee Management System">
			<Breadcrumbs items={breadcrubItems} />
			<EmployeeViewSection />
		</ContentLayout>
	);
}
