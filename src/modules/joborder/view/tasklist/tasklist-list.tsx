import {PaginationResponse, request} from '@/api/axios';
import {useState, useEffect} from 'react';
import {useSearchParams} from 'react-router-dom';
import {columns} from './columns';
import {TaskTable} from './tasklist-table';
import {TicketsSettings} from '@/modules/_configSettings/config';
import {useJoborderStore} from '@/modules/sales/_components/hooks/use-joborder-store';
import {TaskWithDetails} from '../../_components/validation/task';

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
					(status ? `&remarktickets_status=${status}` : '') +
					(sort ? `&sort=${sort}` : ''),
			);
			setRemarkTickets(res.data);
			setPageCount(Math.ceil(res.total_data / pageLimit));
		};

		fetchEmployees();
	}, [offset, pageLimit, sort, status]);

	const task = TicketsSettings.getInstance();

	return (
		<TaskTable
			columns={columns}
			data={remarkTickets}
			searchKey={'uuid'}
			pageCount={pageCount}
			task_status={task.getRemarkTicketStatus()}
		/>
	);
}
