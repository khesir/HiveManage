import {ApiRequest, request} from '@/api/axios';

import {OrderProduct} from '@/components/validation/order-product';

import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {ColumnDef} from '@tanstack/react-table';
import {OrderLogs} from '@/components/interface/logs';
import {AvatarCircles} from '@/components/ui/avatarcircles';

import {OrderLogsSheetTable} from './sheet-table';
import {toast} from 'sonner';
const columns: ColumnDef<OrderLogs>[] = [
	{
		header: 'Handled By',
		cell: ({row}) => {
			return (
				<div className="flex gap-3 items-center">
					<AvatarCircles
						avatar={[
							{
								link:
									typeof row.original.performed_by?.profile_link === 'string'
										? row.original.performed_by?.profile_link
										: '',
								name: row.original.performed_by?.firstname ?? '',
							},
						]}
					/>
					<span>{`${row.original.performed_by.firstname} ${row.original.performed_by.lastname}`}</span>
				</div>
			);
		},
	},
	{
		accessorKey: 'total_quantity',
		header: 'Total Quantity',
	},
	{
		accessorKey: 'ordered_quantity',
		header: 'Ordered Quantity',
	},
	{
		accessorKey: 'delivered_quantity',
		header: 'Delivered Quantity',
	},
	{
		accessorKey: 'resolved_quantity',
		header: 'Resolved Quantity',
	},
	{
		accessorKey: 'status',
		header: 'Status',
	},
	{
		accessorKey: 'action_type',
		header: 'Action Type',
	},
];
interface Props {
	orderProduct: OrderProduct;
}

export function LogTable({orderProduct}: Props) {
	const {id} = useParams();
	const [currentItem, setCurrentItem] = useState<OrderProduct>();
	useEffect(() => {
		if (!orderProduct?.order_product_id || !id) return;
		const fetchData = async () => {
			const response = await request<ApiRequest<OrderProduct>>(
				'GET',
				`/api/v1/ims/order/${id}/order-product/${orderProduct.order_product_id}`,
			);
			if (!Array.isArray(response.data)) {
				setCurrentItem(response.data);
			} else {
				toast.error(
					`Expected an object but received an array: ${JSON.stringify(response.data)}`,
				);
			}
		};
		fetchData();
	}, []);

	return (
		<OrderLogsSheetTable
			columns={columns}
			data={
				(currentItem?.order_log ?? []).map((log) => ({
					...log,
					performed_by: {
						...log.performed_by,
						profile_link: new File([], log.performed_by.profile_link || ''),
					},
				})) || []
			}
		/>
	);
}
