import {Card, CardHeader, CardTitle} from '@/components/ui/card';

import {Separator} from '@/components/ui/separator';
import {useEffect, useState} from 'react';
import {useParams, useSearchParams} from 'react-router-dom';

import {ApiRequest, request} from '@/api/axios';
import {StockLogsMini} from '../../stocklogs/stocklogs-mini';
import {Product} from '@/modules/inventory/_components/validation/product';
import {InformationCard} from './information-card';
import {ViewRecordTabs} from '../item-record-tabs';

export function ProductInformationTab() {
	const [searchParams] = useSearchParams();
	const {id} = useParams();
	const [products, setProducts] = useState<Product | undefined>(undefined);
	useEffect(() => {
		const fetchData = async () => {
			const res = await request<ApiRequest<Product>>(
				'GET',
				`/api/v1/ims/product/${id}`,
			);
			if (!Array.isArray(res.data)) {
				setProducts(res.data);
			} else {
				setProducts(res.data[0]);
			}
		};
		fetchData();
	}, []);
	if (!products || !id) {
		return <Card>No products found</Card>;
	}

	return (
		<div className="flex flex-col sm:gap-4">
			<div className="flex justify-center">
				{/* Product List */}
				<div className="flex justify-between gap-5 h-[300px]">
					<div className="relative w-[300px] h-full overflow-hidden rounded-md">
						<img
							src={
								typeof products.img_url === 'string'
									? products.img_url
									: `/img/placeholder.jpg`
							}
							alt="Selected profile"
							className="object-cover h-full w-full"
						/>
					</div>
					<div className="max-h-full flex-1 ">
						<InformationCard data={products} />
					</div>
					<div>
						test
					</div>
				</div>
			</div>
			<ViewRecordTabs searchParams={searchParams} product_id={id} />
		</div>
	);
}
