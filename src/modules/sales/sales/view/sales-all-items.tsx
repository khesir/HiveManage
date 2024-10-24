import {PaginationResponse, request} from '@/api/axios';
import {Customer} from '@/lib/cms-zod-schema';
import {ItemWithDetails} from '@/lib/inventory-zod-schema';
import {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {SalesTable} from './sales-table';
import {columns} from './columns';
import {SalesItemWithDetails} from '@/lib/sales-zod-schema';

export function SalesAllItem() {
	const [searchParams] = useSearchParams();
	const [items, setSalesItem] = useState<SalesItemWithDetails[]>([]);
	const [pageCount, setPageCount] = useState<number>(0);

	const [pageLimit, setPageLimit] = useState<number>(
		Number(searchParams.get('limit')) || 10,
	);
	const page = Number(searchParams.get('page')) || 1;
	const status = searchParams.get('status') || null;
	const sort = searchParams.get('sort') || null;
	const offset = (page - 1) * pageLimit;

	useEffect(() => {
		const fetchEmployees = async () => {
			const res = await request<PaginationResponse<SalesItemWithDetails>>(
				'GET',
				`/api/v1/ims/item?on_listing=true&limit=${pageLimit}&offset=${offset}` +
					(status ? `&status=${status}` : '') +
					(sort ? `&sort=${sort}` : ''),
			);
			setSalesItem(res.data);
			setPageCount(Math.ceil(res.total_data / pageLimit));
		};

		fetchEmployees();
	}, [offset, pageLimit, sort, status]);

	return (
		<SalesTable
			columns={columns}
			data={items}
			searchKey={'type'}
			pageCount={0}
		/>
	);
}
