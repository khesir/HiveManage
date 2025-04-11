import {ContentLayout} from '@/components/appLayout/content-layout';

import {Breadcrumbs} from '@/components/ui/breadcrumbs';

const breadcrubItems = [
	{title: 'Dashboard', link: 'sales/dashboard'},
	{title: 'Systems', link: 'sales/overview'},
	{title: 'Overview', link: 'sales/overview'},
	{title: 'Services', link: 'sales/services'},
	{title: 'View', link: '#'},
];
export default function ViewServicePage() {
	return (
		<ContentLayout title="PC BEE Management Systems">
			<Breadcrumbs items={breadcrubItems} />
		</ContentLayout>
	);
}
