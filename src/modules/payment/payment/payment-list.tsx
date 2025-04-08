import {useState, useEffect} from 'react';
import {PaginationResponse, request} from '@/api/axios';
import {Payment} from '@/components/validation/payment';
import {PaymentTable} from './payment-table';
import {columns} from './columns';

export type paramsProps = {
	searchParams: URLSearchParams;
};

export default function PaymentList({searchParams}: paramsProps) {
	const [payment, setPayment] = useState<Payment[]>([]);
	const [pageCount, setPageCount] = useState<number>(0);

	const page = Number(searchParams.get('page')) || 1;
	const pageLimit = Number(searchParams.get('limit')) || 10;
	const payment_method = searchParams.get('payment_method') || null;
	const sort = searchParams.get('sort') || null;
	const offset = (page - 1) * pageLimit;

	useEffect(() => {
		const fetchEmployees = async () => {
			const res = await request<PaginationResponse<Payment>>(
				'GET',
				`/api/v1/payment?limit=${pageLimit}&offset=${offset}` +
					(payment_method ? `&payment_method=${payment_method}` : '') +
					(sort ? `&sort=${sort}` : ''),
			);
			setPayment(res.data);
			setPageCount(Math.ceil(res.total_data / pageLimit));
		};

		fetchEmployees();
	}, [offset, pageLimit, sort, payment_method]);

	return (
		<PaymentTable columns={columns} data={payment} pageCount={pageCount} />
	);
}
