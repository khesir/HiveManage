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
			<div className="grid flex-1 items-start gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
				{/* Product List */}
				<div className="grid items-start auto-rows-max gap-4 gap md:gap-6 lg:col-span-2">
					<div className="flex gap-5 h-[200px]">
						<div className="max-h-full flex-1 ">
							<InformationCard data={products} />
						</div>
						<div className="relative w-[200px] h-full overflow-hidden rounded-md">
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
					</div>
					<ViewRecordTabs searchParams={searchParams} product_id={id} />
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex lg:hidden">
						<Separator />
					</div>
					{/* <ProductOrder /> */}
					{/* <ProductStockCard product={products} /> */}
					<Card x-chunk="dashboard-01-chunk-5" className="flex-1">
						<CardHeader>
							<CardTitle>Stock Logs</CardTitle>
						</CardHeader>
						<StockLogsMini product_id={id} />
					</Card>
				</div>
			</div>
		</div>
	);
}
