import {PaginationResponse, request} from '@/api/axios';
import {useEffect, useState} from 'react';
import {useParams, useSearchParams} from 'react-router-dom';
import {SalesTable} from './sales-table';
import {columns} from './columns';
import {SalesItemWithDetails} from '@/lib/sales-zod-schema';
import {useSalesItemWithDetailsStore} from './hooks/use-sales-item-store';

interface SalesAllItemProps {
	item_type?: string;
}

export function SalesAllItem({item_type}: SalesAllItemProps) {
	const [searchParams] = useSearchParams();
	const {id} = useParams();
	const [items, setSalesItem] = useState<SalesItemWithDetails[]>([]);
	const [pageCount, setPageCount] = useState<number>(0);
	const pageLimit = Number(searchParams.get('limit')) || 10;

	const page = Number(searchParams.get('page')) || 1;
	const sales_item_type =
		item_type || searchParams.get('sales_item_type') || null;
	const sort = searchParams.get('sort') || null;
	const offset = (page - 1) * pageLimit;
	const {setSelectedSalesItemWithDetails} = useSalesItemWithDetailsStore();

	useEffect(() => {
		const fetchEmployees = async () => {
			const res = await request<PaginationResponse<SalesItemWithDetails>>(
				'GET',
				`/api/v1/sms/service/${id}/sales-item?limit=${pageLimit}&offset=${offset}` +
					(sales_item_type ? `&sales_item_type=${sales_item_type}` : '') +
					(sort ? `&sort=${sort}` : ''),
			);
			setSalesItem(res.data);
			setSelectedSalesItemWithDetails(res.data);
			setPageCount(Math.ceil(res.total_data / pageLimit));
		};

		fetchEmployees();
	}, [offset, pageLimit, sort, status]);

	return <SalesTable columns={columns} data={items} pageCount={pageCount} />;
}
