import {Card} from '@/components/ui/card';

import {useEffect, useState} from 'react';
import {useParams, useSearchParams} from 'react-router-dom';

import {ApiRequest, request} from '@/api/axios';
import {Product} from '@/modules/inventory/_components/validation/product';
import {InformationCard} from './information-card';
import ItemRecordList from '../tables/itemRecords/item-record-list';

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
		<div className="flex flex-col sm:gap-4 max-w-full">
			<div className="w-full">
				{/* Product List */}
				<div className="flex gap-5 h-[300px] w-full">
					{/* First section: 30% */}
					<div className="relative h-full overflow-hidden rounded-md flex-[1_1_30%] min-w-[250px]">
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

					{/* Middle section: 40% */}
					<div className="flex-[1_1_40%] min-w-[300px]">
						<InformationCard data={products} />
					</div>

					{/* Third section: 30% */}
					<div className="flex-[1_1_30%] min-w-[250px]">
						<Card className="gap-8 p-4 md:grid h-full w-full">
							<div className="grid gap-3">
								<div className="font-semibold">Stock records</div>

								<ul className="grid gap-3">
									<li className="flex items-center justify-between">
										<span className="text-muted-foreground">Orders</span>
										<span>0 Items ordered</span>
									</li>
									{products.is_serialize ? (
										<li className="flex items-center justify-between">
											<span className="text-muted-foreground">
												Serialize Record
											</span>
											<span>
												{products.product_serials?.length ?? 0} Items recorded
											</span>
										</li>
									) : (
										<li className="flex items-center justify-between">
											<span className="text-muted-foreground">
												Batch Record
											</span>
											<span>
												{products.product_records?.reduce(
													(sum, record) => sum + record.quantity,
													0,
												)}{' '}
												Qty
											</span>
										</li>
									)}
								</ul>
							</div>
						</Card>
					</div>
				</div>
			</div>
			<ItemRecordList searchParams={searchParams} product_id={id} />
		</div>
	);
}
