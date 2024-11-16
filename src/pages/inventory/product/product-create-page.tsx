import {ContentLayout} from '@/components/appLayout/content-layout';
import {Breadcrumbs} from '@/components/ui/breadcrumbs';
import CreateProductSection from '@/modules/inventory/_section/product/create-product';

const breadcrubItems = [
	{title: 'Dashboard', link: 'admin/dashboard'},
	{title: 'Systems', link: 'admin/inventory/products'},
	{title: 'Inventory', link: 'admin/inventory/products'},
	{title: 'Products', link: 'admin/inventory/products'},
	{title: 'Create', link: 'admin/inventory/products/create'},
];

export default function CreateProductPage() {
	return (
		<ContentLayout title={'PC BEE Management Systems'}>
			<Breadcrumbs items={breadcrubItems} />
			<CreateProductSection />
		</ContentLayout>
	);
}
