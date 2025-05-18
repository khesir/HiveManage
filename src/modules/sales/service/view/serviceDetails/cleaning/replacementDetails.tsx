import {ApiRequest, request} from '@/api/axios';
import {CardContent} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {useEffect, useState} from 'react';
import {ReplacementDialog} from './replacementDialog';
import {ReplacementDetails} from '@/components/validation/service-details';
import {useParams} from 'react-router-dom';

export function ReplacementDetailsCard() {
	const [replacementDetails, setReplacementDetails] =
		useState<ReplacementDetails | null>(null);
	const [loading, setLoading] = useState(false);
	const {joborder_id, service_id} = useParams();
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const res = await request<ApiRequest<ReplacementDetails>>(
				'GET',
				`/api/v1/sms/joborder/${joborder_id}/service/${service_id}/replacement-details`,
			);
			setReplacementDetails(
				Array.isArray(res.data) ? (res.data[0] ?? null) : res.data,
			);
		};
		fetchData();
		setLoading(false);
	}, []);

	if (loading) {
		return <Skeleton className="w-[200px]"></Skeleton>;
	}

	if (replacementDetails === null) {
		return (
			<CardContent className="flex flex-col justify-center items-center font-semibold gap-3 p-3">
				No Existing Replacement Details
				<ReplacementDialog />
			</CardContent>
		);
	}
	return <div>Content</div>;
}
