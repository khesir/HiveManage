import {ContentLayout} from '@/components/layout/content-layout';

import {Breadcrumbs} from '@/components/ui/breadcrumbs';
import {Heading} from '@/components/ui/heading';

const breadcrubItems = [{title: 'Dashboard', link: 'admin/dashboard'}];

export default function SalesPage() {
	return (
		<ContentLayout title="PC BEE Management Systems">
			<Breadcrumbs items={breadcrubItems} />
			<Heading title={'Dashboard'} description={'Hello world'} />
		</ContentLayout>
	);
}
