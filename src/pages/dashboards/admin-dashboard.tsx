import {ContentLayout} from '@/components/appLayout/content-layout';
import {Breadcrumbs} from '@/components/ui/breadcrumbs';
import {Heading} from '@/components/ui/heading';

const breadcrubItems = [{title: 'Dashboard', link: 'admin/dashboard'}];

export default function DashboardPage() {
	return (
		<ContentLayout title={'PC BEE Management Systems'}>
			<Breadcrumbs items={breadcrubItems} />
			<Heading
				title={'Modules'}
				description={'List of all modules that need to be coded'}
			/>
			<p>Under Development</p>
		</ContentLayout>
	);
}
