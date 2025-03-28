import {useState, useEffect} from 'react';
import {PaginationResponse, request} from '@/api/axios';
import {Supplier} from '../../../components/validation/inventory/supplier';
import {columns} from './columns';
import {SupplierTable} from './supplier-table';

export type paramsProps = {
	searchParams: URLSearchParams;
	modalRefreshTrigger?: boolean;
};

export default function SupplierList({
	searchParams,
	modalRefreshTrigger,
}: paramsProps) {
	const [supplier, setSupplier] = useState<Supplier[]>([]);
	const [pageCount, setPageCount] = useState<number>(0);

	const page = Number(searchParams.get('page')) || 1;
	const pageLimit = Number(searchParams.get('limit')) || 10;
	const sort = searchParams.get('sort') || null;
	const offset = (page - 1) * pageLimit;

	useEffect(() => {
		const fetchEmployees = async () => {
			const res = await request<PaginationResponse<Supplier>>(
				'GET',
				`/api/v1/ims/supplier?limit=${pageLimit}&offset=${offset}` +
					(sort ? `&sort=${sort}` : ''),
			);
			setSupplier(res.data);
			setPageCount(Math.ceil(res.total_data / pageLimit));
		};

		fetchEmployees();
	}, [offset, pageLimit, sort, modalRefreshTrigger]);
	return (
		<SupplierTable
			searchKey="name"
			columns={columns}
			data={supplier}
			pageCount={pageCount}
		/>
	);
}
