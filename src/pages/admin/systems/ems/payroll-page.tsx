import {ContentLayout} from '@/components/appLayout/content-layout';
import {Breadcrumbs} from '@/components/ui/breadcrumbs';
import PayrollSection from '@/modules/ems/_sections/employee/payroll-section';
import {useSearchParams} from 'react-router-dom';

const breadcrubItems = [
	{title: 'Dashboard', link: '/admin/dashboard'},
	{title: 'Employee Mangement System', link: '/admin/ems/overview'},
	{title: 'Overview', link: '/admin/ems/overview'},
	{title: 'Payroll', link: '/admin/ems/payroll'},
];

export default function EmployeePayrollPage() {
	const [searchParams] = useSearchParams();
	return (
		<ContentLayout title={'Employee Mangament System'}>
			<Breadcrumbs items={breadcrubItems} />
			<PayrollSection searchParams={searchParams} />
		</ContentLayout>
	);
}
