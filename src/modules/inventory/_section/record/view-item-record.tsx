import ItemRecordList from '../../products/view/record/record-list';
import {useEffect, useState} from 'react';
import {ItemRecords} from '../../_components/validation/item-record';
import {useParams} from 'react-router-dom';
import {ApiRequest, request} from '@/api/axios';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import {ItemProfile} from '../../products/view/record/record-profile';
import {Button} from '@/components/ui/button';

export default function ItemRecordSection() {
	const {id, item_record_id} = useParams();
	console.log(id);
	const [itemRecord, setItemRecord] = useState<ItemRecords>();
	useEffect(() => {
		const fetchData = async () => {
			const res = await request<ApiRequest<ItemRecords[]>>(
				'GET',
				`/api/v1/ims/product/${id}/item-record/${item_record_id}`,
			);
			setItemRecord(res.data[0] as ItemRecords);
		};
		fetchData();
	}, []);
	return (
		<div className="flex flex-row sm:gap-4">
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
						<CardHeader className="relative flex flex-row items-center bg-muted/50">
							<div
								className="absolute inset-0 z-0 rounded-lg bg-cover bg-center"
								style={{
									backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8)), url(${
										itemRecord?.supplier?.profile_link
											? itemRecord?.supplier?.profile_link
											: '/img/placeholder.jpg'
									})`,
								}}
							></div>
							<div className="relative z-10 flex gap-4">
								<img
									src={
										typeof itemRecord?.supplier?.profile_link === 'string'
											? itemRecord?.supplier?.profile_link
											: '/img/placeholder.jpg'
									}
									alt={`Supplier ID ${itemRecord?.supplier?.supplier_id} - ${itemRecord?.supplier?.name}`}
									className="rounded-lg w-20 h-20 object-cover"
								/>
								<div className="grid gap-0.5 text-white">
									<CardTitle className="group flex items-center gap-2 text-lg">
										{`#${itemRecord?.supplier?.supplier_id} ${itemRecord?.supplier?.name}`}
									</CardTitle>
									<CardDescription className="text-gray-400">
										{itemRecord?.supplier?.remarks}
									</CardDescription>
								</div>
							</div>
						</CardHeader>
					</Card>
					<Button>Add Item</Button>
				</div>
				<ItemRecordList />
			</div>
			<div className="flex-1">
				<ItemProfile />
			</div>
		</div>
	);
}
