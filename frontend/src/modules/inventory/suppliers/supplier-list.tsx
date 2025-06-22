import {useState, useEffect} from 'react';
import {PaginationResponse, request} from '@/api/axios';
import {Supplier} from '../../../components/validation/supplier';
import {columns} from './columns';
import {SupplierTable} from './supplier-table';
import {useSearchParams} from 'react-router-dom';

export default function SupplierList() {
	const [searchParams] = useSearchParams();
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
	}, [offset, pageLimit, sort]);
	return (
		<SupplierTable
			searchKey="name"
			columns={columns}
			data={supplier}
			pageCount={pageCount}
		/>
	);
}
