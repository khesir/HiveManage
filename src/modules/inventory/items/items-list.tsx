import {useState, useEffect} from 'react';
import {PaginationResponse, request} from '@/api/axios';
import {columns} from './columns';
import {useSearchParams} from 'react-router-dom';
import {ItemWithDetails} from '@/lib/inventory-zod-schema';
import {ItemsWithDetailsTable} from './items.table';

export default function ItemsWithDetailsList() {
	const [searchParams] = useSearchParams();
	const [items, setItems] = useState<ItemWithDetails[]>([]);
	const [pageCount, setPageCount] = useState<number>(0);

	const page = Number(searchParams.get('page')) || 1;
	const pageLimit = Number(searchParams.get('limit')) || 10;
	const sort = searchParams.get('sort') || null;
	const offset = (page - 1) * pageLimit;

	useEffect(() => {
		const fetchEmployees = async () => {
			const res = await request<PaginationResponse<ItemWithDetails>>(
				'GET',
				`/api/v1/ims/item?limit=${pageLimit}&offset=${offset}` +
					(sort ? `&sort=${sort}` : ''),
			);
			setItems(res.data);
			setPageCount(Math.ceil(res.total_data / pageLimit));
		};

		fetchEmployees();
	}, [offset, pageLimit, sort, status]);

	return (
		<ItemsWithDetailsTable
			columns={columns}
			searchKey="id"
			data={items}
			pageCount={pageCount}
		/>
	);
}
