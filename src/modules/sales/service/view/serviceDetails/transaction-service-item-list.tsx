import {useState, useEffect} from 'react';
import {PaginationResponse, request} from '@/api/axios';
import {useParams, useSearchParams} from 'react-router-dom';
import {Ticket} from '@/components/validation/tickets';
import {columns} from './column';
import {TransactionServiceItemTable} from './transaction-service-item-table';

export type paramsProps = {
	searchParams: URLSearchParams;
};

export default function TransactionServiceItemList() {
	const [searchParams] = useSearchParams();
	const [ticket, setTicket] = useState<Ticket[]>([]);
	const [pageCount, setPageCount] = useState<number>(0);
	const {id} = useParams();

	const page = Number(searchParams.get('page')) || 1;
	const pageLimit = Number(searchParams.get('limit')) || 10;
	const ticketType = searchParams.get('ticketType') || null;
	const sort = searchParams.get('sort') || null;
	const offset = (page - 1) * pageLimit;

	useEffect(() => {
		const fetchEmployees = async () => {
			const res = await request<PaginationResponse<Ticket>>(
				'GET',
				`/api/v1/sms/service/${id}/ticket?limit=${pageLimit}&offset=${offset}` +
					(ticketType ? `&ticketType=${ticketType}` : '') +
					(sort ? `&sort=${sort}` : ''),
			);
			setTicket(res.data);
			setPageCount(Math.ceil(res.total_data / pageLimit));
		};

		fetchEmployees();
	}, [offset, pageLimit, sort, ticketType]);
	return (
		<TransactionServiceItemTable
			columns={columns}
			data={ticket}
			pageCount={pageCount}
		/>
	);
}
