import {PaginationResponse, request} from '@/api/axios';
import {useState, useEffect} from 'react';
import {useSearchParams} from 'react-router-dom';
import {useJoborderStore} from '../../hook/useJoborderStore';
import {columns} from './columns';
import {TaskTable} from './tasklist-table';
import {TaskWithDetails} from '../../validation/task';

export function TaskList() {
	const {joborderData} = useJoborderStore();
	const [searchParams] = useSearchParams();

	const [remarkTickets, setRemarkTickets] = useState<TaskWithDetails[]>([]);
	const [pageCount, setPageCount] = useState<number>(0);

	const page = Number(searchParams.get('page')) || 1;
	const pageLimit = Number(searchParams.get('limit')) || 10;
	const status = searchParams.get('status') || null;
	const sort = searchParams.get('sort') || null;
	const offset = (page - 1) * pageLimit;

	useEffect(() => {
		const fetchEmployees = async () => {
			const res = await request<PaginationResponse<TaskWithDetails>>(
				'GET',
				`/api/v1/sms/service/${joborderData?.service.service_id}/joborder/${joborderData?.joborder_id}/remark-tickets?limit=${pageLimit}&offset=${offset}` +
					(status ? `&joborder_status=${status}` : '') +
					(sort ? `&sort=${sort}` : ''),
			);
			setRemarkTickets(res.data);
			setPageCount(Math.ceil(res.total_data / pageLimit));
		};

		fetchEmployees();
	}, [offset, pageLimit, sort, status]);
	console.log(remarkTickets);
	return (
		<TaskTable
			columns={columns}
			data={remarkTickets}
			searchKey={'uuid'}
			pageCount={pageCount}
		/>
	);
}
