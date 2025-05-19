import {ApiRequest, request} from '@/api/axios';
import {CardContent} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {useEffect, useState} from 'react';
import {CleaningDialog} from './cleaningDialog';
import {CleaningDetails} from '@/components/validation/service-details';
import {useParams} from 'react-router-dom';
import {useServiceDetails} from '../../../_components/use-service-details-hook';

export function CleaningDetailsCard() {
	const {serviceDetails, setServiceDetails} = useServiceDetails();

	const [loading, setLoading] = useState(false);
	const {joborder_id, service_id} = useParams();
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const res = await request<ApiRequest<CleaningDetails>>(
				'GET',
				`/api/v1/sms/joborder/${joborder_id}/service/${service_id}/cleaning-details`,
			);
			setServiceDetails(
				Array.isArray(res.data) ? (res.data[0] ?? null) : res.data,
			);
		};
		fetchData();
		setLoading(false);
	}, []);

	if (loading) {
		return <Skeleton className="w-[200px]"></Skeleton>;
	}

	if (serviceDetails === null) {
		return (
			<CardContent className="flex flex-col justify-center items-center font-semibold gap-3 p-3">
				No Existing Replacement Details
				<CleaningDialog />
			</CardContent>
		);
	}
	return (
		<div className="grid gap-3">
			<div className="font-semibold flex justify-between">
				<span>Cleaning Details</span>
				<CleaningDialog />
			</div>
			<ul className="grid gap-3">
				<li className="flex items-center justify-between">
					<span className="text-muted-foreground">Method</span>
					<span>{(serviceDetails as CleaningDetails).method}</span>
				</li>
				<li className="flex items-center justify-between">
					<span className="text-muted-foreground">Notes</span>
					<span>{(serviceDetails as CleaningDetails).notes}</span>
				</li>
			</ul>
		</div>
	);
}
