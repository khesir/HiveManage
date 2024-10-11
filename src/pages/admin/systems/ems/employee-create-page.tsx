import {ContentLayout} from '@/components/layout/content-layout';
import {Breadcrumbs} from '@/components/ui/breadcrumbs';
import CreateEmployeSection from '@/modules/ems/_sections/create-employee-section';

// This is the Dashboard Page for Employee Management System (EMS)
const breadcrubItems = [
	{title: 'Dashboard', link: 'admin/dashboard'},
	{title: 'Employee Mangement System', link: '/admin/ems/overview'},
	{title: 'Employees', link: '/admin/ems/employees'},
	{title: 'Create', link: '/admin/ems/employees/create'},
];
export default function EmployeeCreatePage() {
	return (
		<ContentLayout title="Employee Management System">
			<Breadcrumbs items={breadcrubItems} />
			<CreateEmployeSection />
		</ContentLayout>
	);
}
