import {SidebarNav} from './_components/sidebar-nav';
import {EmploymentForm} from './form/employment-form';
import {OtherForm} from './form/other-form';
import {PersonalForm} from './form/personal-form';
import {ProfileForm} from './form/profile-form';
import useSettingsFormSelection from './hooks/settings-form-selection';

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
	return (
		<div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 px-5">
			<aside className="-mx-4 lg:w-1/5">
				<SidebarNav items={sidebarNavItems} />
			</aside>
			<div className="flex-1 lg:max-w-2xl">
				{settings === 'Profile' && <ProfileForm />}
				{settings === 'Personal Information' && <PersonalForm />}
				{settings === 'Employment Information' && <EmploymentForm />}
				{settings === 'Others' && <OtherForm />}
			</div>
		</div>
	);
}
