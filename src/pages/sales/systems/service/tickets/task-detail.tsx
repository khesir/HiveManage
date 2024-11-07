import {ContentLayout} from '@/components/appLayout/content-layout';
import {Breadcrumbs} from '@/components/ui/breadcrumbs';
import ViewTask from '@/modules/sales/_sections/task/view-task';

const breadcrubItems = [
	{title: 'Dashboard', link: 'sales/dashboard'},
	{title: 'Systems', link: 'sales/overview'},
	{title: 'Overview', link: 'sales/overview'},
	{title: 'Services', link: 'sales/services'},
	{title: 'View', link: '#'},
	{title: 'Task', link: '#'},
];

export default function ReadTask() {
	return (
		<ContentLayout title="PC BEE Management Systems">
			<Breadcrumbs items={breadcrubItems} />
			<ViewTask />
		</ContentLayout>
	);
}
