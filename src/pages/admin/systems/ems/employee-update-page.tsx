import {ContentLayout} from '@/components/layout/content-layout';
import {Breadcrumbs} from '@/components/ui/breadcrumbs';
import EmployeeSection from '@/modules/ems/_sections/employee/list-employee-section';

// This is the Dashboard Page for Employee Management System (EMS)
const breadcrubItems = [
	{title: 'Dashboard', link: 'admin/dashboard'},
	{title: 'Employee Mangement System', link: '/admin/ems/overview'},
	{title: 'Employees', link: '/admin/ems/employees'},
	{title: 'Update', link: '/admin/ems/employees/update'},
];
export default function EmployeeUpdatePage() {
	return (
		<ContentLayout title="Employee Management System">
			<Breadcrumbs items={breadcrubItems} />
			<EmployeeSection />
		</ContentLayout>
	);
}
