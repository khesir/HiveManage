import {useState, useEffect} from 'react';
import {PaginationResponse, request} from '@/api/axios';
import {Service} from '@/components/validation/service';
import {columns} from './columns';
import {ServiceTable} from './service-table';
import {useParams, useSearchParams} from 'react-router-dom';

export default function ServiceList() {
	const [searchParams] = useSearchParams();
	const {joborder_id} = useParams();
	const [service, setService] = useState<Service[]>([]);
	const [pageCount, setPageCount] = useState<number>(0);

	const page = Number(searchParams.get('page')) || 1;
	const pageLimit = Number(searchParams.get('limit')) || 10;
	const serviceType = searchParams.get('service_type') || null;
	const sort = searchParams.get('sort') || null;
	const offset = (page - 1) * pageLimit;
	const uuid = searchParams.get('uuid') || undefined;

	useEffect(() => {
		const fetchEmployees = async () => {
			const res = await request<PaginationResponse<Service>>(
				'GET',
				`/api/v1/sms/joborder/${joborder_id}/service?joborder_service_only=true&limit=${pageLimit}&offset=${offset}` +
					(serviceType ? `&serviceType=${serviceType}` : '') +
					(sort ? `&sort=${sort}` : '') +
					(uuid ? `&product_name=${uuid}` : ''),
			);
			setService(res.data);
			setPageCount(Math.ceil(res.total_data / pageLimit));
		};

		fetchEmployees();
	}, [offset, pageLimit, sort, serviceType]);
	return (
		<ServiceTable
			columns={columns}
			data={service}
			pageCount={pageCount}
			searchKey={'uuid'}
		/>
	);
}
