import {ApiRequest, request} from '@/api/axios';
import {CardContent} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {useEffect, useState} from 'react';
import {RentDetails} from '@/components/validation/service-details';
import {useParams} from 'react-router-dom';
import {RentDialog} from './rentDialog';
import {useServiceDetails} from '../../../_components/use-service-details-hook';
import {dateParser} from '@/lib/util/utils';

export function RentDetailsCard() {
	const {serviceDetails, setServiceDetails} = useServiceDetails();
	const [loading, setLoading] = useState(false);
	const {joborder_id, service_id} = useParams();
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const res = await request<ApiRequest<RentDetails>>(
				'GET',
				`/api/v1/sms/joborder/${joborder_id}/service/${service_id}/rent-details`,
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
				<RentDialog />
			</CardContent>
		);
	}
	return (
		<div className="grid gap-3">
			<div className="font-semibold flex justify-between">
				<span>Rent Details</span>
				<RentDialog />
			</div>
			<ul className="grid gap-3">
				<li className="flex items-center justify-between">
					<span className="text-muted-foreground">
						Rented Items (Service Items)
					</span>
					<span>
						{(serviceDetails as RentDetails).serviceItems?.length ?? 0}
					</span>
				</li>
				<li className="flex items-center justify-between">
					<span className="text-muted-foreground">Start Date</span>
					<span>{dateParser((serviceDetails as RentDetails).start_date)}</span>
				</li>
				<li className="flex items-center justify-between">
					<span className="text-muted-foreground">End Date</span>
					<span>{dateParser((serviceDetails as RentDetails).end_date)}</span>
				</li>
				<li className="flex items-center justify-between">
					<span className="text-muted-foreground">Deposit</span>
					<span>{(serviceDetails as RentDetails).deposit}</span>
				</li>

				<li className="flex items-center justify-between">
					<span className="text-muted-foreground">Returned</span>
					<span>
						{(serviceDetails as RentDetails).returned ? 'True' : 'False'}
					</span>
				</li>
			</ul>
		</div>
	);
}
