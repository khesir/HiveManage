import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {SidebarNav} from './_components/sidebar-nav';
import useSettingsFormSelection from './hooks/settings-form-selection';
import {ProfileForm} from './form/profile-form';
import {Card} from '@/components/ui/card';
import {Product} from '@/modules/inventory/_components/validation/product';
import {ApiRequest, request} from '@/api/axios';
import {SupplierForm} from './form/supplier-form';

const sidebarNavItems = [
	{
		title: 'Profile',
	},
	{
		title: 'Suppliers',
	},
	// {
	// 	title: 'Employment Information',
	// },
	{
		title: 'Others',
	},
];

export default function SettingsSidebar() {
	const {settings} = useSettingsFormSelection();
	const [products, setProducts] = useState<Product | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(false);
	const {id} = useParams();
	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const res = await request<ApiRequest<Product>>(
					'GET',
					`/api/v1/ims/product/${id}`,
				);
				if (!Array.isArray(res.data)) {
					setProducts(res.data);
				} else {
					setProducts(res.data[0]);
				}
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
	if (!products) {
		return <Card>Something went wrong, trying again</Card>;
	}
	return (
		<div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 px-5 w-full">
			<aside className="-mx-4 lg:w-1/5">
				<SidebarNav items={sidebarNavItems} />
			</aside>
			<div className="flex-1">
				{settings === 'Profile' && <ProfileForm selectedProduct={products} />}
				{settings === 'Suppliers' && <SupplierForm />}
				{/* {settings === 'Employment Information' && (
					<EmploymentForm selectedEmployee={selectedEmployee} />
				)}
				{settings === 'Others' && <OtherForm />} */}
			</div>
		</div>
	);
}
