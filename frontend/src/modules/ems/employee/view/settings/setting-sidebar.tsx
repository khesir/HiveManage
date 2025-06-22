import {useEmployeeStore} from '@/modules/ems/_components/hooks/use-employee-story';
import {SidebarNav} from './_components/sidebar-nav';
import {EmploymentForm} from './form/employment-form';
import {OtherForm} from './form/other-form';
import {PersonalForm} from './form/personal-form';
import {ProfileForm} from './form/profile-form';
import useSettingsFormSelection from './hooks/settings-form-selection';
import {PaginationResponse, request} from '@/api/axios';
import {Card} from '@/components/ui/card';
import {EmployeeRolesWithDetails} from '@/modules/ems/_components/validation/employeeRoles';
import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

const sidebarNavItems = [
	{
		title: 'Profile',
	},
	{
		title: 'Personal Information',
	},
	{
		title: 'Employment Information',
	},
	{
		title: 'Others',
	},
];

export default function SettingsSidebar() {
	const {settings} = useSettingsFormSelection();
	const {selectedEmployee, setSelectedEmployee} = useEmployeeStore();
	const [loading, setLoading] = useState<boolean>(false);
	const {id} = useParams();
	console.log(id);
	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const empRoleData = await request<
					PaginationResponse<EmployeeRolesWithDetails>
				>('GET', `/api/v1/ems/employeeRoles?employee_id=${id}`);
				setSelectedEmployee(empRoleData.data[0]);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [id]);

	if (loading) {
		return <Card>Fetching data</Card>;
	}
	if (!selectedEmployee) {
		return <Card>Something went wrong, trying again</Card>;
	}
	return (
		<div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 px-5">
			<aside className="-mx-4 lg:w-1/5">
				<SidebarNav items={sidebarNavItems} />
			</aside>
			<div className="flex-1 lg:max-w-3xl">
				{settings === 'Profile' && (
					<ProfileForm selectedEmployee={selectedEmployee} />
				)}
				{settings === 'Personal Information' && (
					<PersonalForm selectedEmployee={selectedEmployee} />
				)}
				{settings === 'Employment Information' && (
					<EmploymentForm selectedEmployee={selectedEmployee} />
				)}
				{settings === 'Others' && <OtherForm />}
			</div>
		</div>
	);
}
