import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card';

import {useEffect, useState} from 'react';
import {useParams, useSearchParams} from 'react-router-dom';

import {ApiRequest, request} from '@/api/axios';
import {Product} from '@/components/validation/product';
import {InformationCard} from './information-card';

import {ViewRecordTabs} from '../item-record-tabs';
import {CreatePODialogue} from '../../_components/dialogue/create-po-dialogue';

export function ProductInformationTab() {
	const [searchParams] = useSearchParams();
	const {id} = useParams();
	const [data, setData] = useState<Product>();
	const fetchData = async () => {
		const newProductData = await request<ApiRequest<Product>>(
			'GET',
			`/api/v1/ims/product/${id}`,
		);
		if (!Array.isArray(newProductData.data)) {
			setData(newProductData.data);
		} else {
			setData(newProductData.data[0]);
		}
	};
	useEffect(() => {
		fetchData();
	}, []);
	if (!data || !id) {
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
								typeof data.img_url === 'string'
									? data.img_url
									: `/img/placeholder.jpg`
							}
							alt="Selected profile"
							className="object-cover h-full w-full"
						/>
					</div>

					{/* Middle section: 40% */}
					<div className="flex-[1_1_40%] min-w-[300px]">
						<InformationCard data={data} refreshOnRender={fetchData} />
					</div>

					{/* Third section: 30% */}
					<div className="flex-[1_1_30%] min-w-[250px]">
						<Card className="flex flex-col lg:max-w-md h-full">
							<CardHeader>
								<div className="font-semibold">Stock records</div>
							</CardHeader>
							<CardContent>
								<div className="grid gap-3">
									<ul className="grid gap-3">
										<li className="flex items-center justify-between">
											<span className="text-muted-foreground">
												Available Quantity
											</span>
											<span>{data.available_quantity}</span>
										</li>
										<li className="flex items-center justify-between">
											<span className="text-muted-foreground">
												Sold Quantity
											</span>
											<span>{data.available_quantity}</span>
										</li>
										<li className="flex items-center justify-between">
											<span className="text-muted-foreground">
												Total Quantity
											</span>
											<span>{data.available_quantity}</span>
										</li>
										<li className="flex items-center justify-between">
											<span className="text-muted-foreground">
												Transfered Quantity
											</span>
											<span>{data.available_quantity}</span>
										</li>
									</ul>
								</div>
							</CardContent>
							<CardFooter className="w-full">
								<CreatePODialogue id={data.product_id!} />
							</CardFooter>
						</Card>
					</div>
				</div>
			</div>
			<ViewRecordTabs
				product_id={id}
				searchParams={searchParams}
				is_serialize={data.is_serialize ?? false}
			/>
		</div>
	);
}
