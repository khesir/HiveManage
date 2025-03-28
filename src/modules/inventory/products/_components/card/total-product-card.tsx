import {ApiRequest, request} from '@/api/axios';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {Product} from '@/components/validation/inventory/product';
import {PackageOpen} from 'lucide-react';
import {useEffect, useState} from 'react';

export function TotalProductCard() {
	const [products, setProducts] = useState<Product[]>();
	useEffect(() => {
		const fetchData = async () => {
			const res = await request<ApiRequest<Product>>(
				'GET',
				`/api/v1/ims/product?no_pagination=true`,
			);
			setProducts(res.data as Product[]);
		};
		fetchData();
	}, []);
	return (
		<Card
			x-chunk="dashboard-05-chunk-1"
			className="flex-1 relative overflow-hidden flex flex-col justify-center"
		>
			<CardHeader className="pb-2">
				<CardDescription>Total Products</CardDescription>
			</CardHeader>
			<CardContent>
				<CardTitle className="text-4xl">{products?.length}</CardTitle>
				{/* <div className="text-xs text-muted-foreground">15 are listed</div> */}
			</CardContent>
			<PackageOpen className="absolute w-[250px] h-[250px] -bottom-5 -right-20 text-slate-700" />
		</Card>
	);
}
