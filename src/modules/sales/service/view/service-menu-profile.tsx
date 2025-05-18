import useServiceTypeStore from '../_components/use-serviceType-hook';
import {Card} from '@/components/ui/card';
import {AddEmployeeSelection} from '../_components/dialogue/employee-selection';
import useEmployeeStore from '../_components/use-employee-list-hook';
import {AvatarCircles} from '@/components/ui/avatarcircles';
import {toast} from 'sonner';
import {Service} from '@/components/validation/service';
import {useEmployeeRoleDetailsStore} from '@/modules/authentication/hooks/use-sign-in-userdata';
import {generateCustomUUID} from '@/lib/util/utils';
import {useParams} from 'react-router-dom';
import {ReplacementForm} from './serviceDetails/replacement/replacementFormDialog';
import {
	BuildDetails,
	CleaningDetails,
	RentDetails,
	RepairDetails,
	ReplacementDetails,
	UpgradeDetails,
} from '@/components/validation/service-details';
import {ApiRequest, request} from '@/api/axios';
import {AxiosError} from 'axios';
type ServiceDetails =
	| ReplacementDetails
	| BuildDetails
	| CleaningDetails
	| RentDetails
	| RepairDetails
	| UpgradeDetails;
export function ServiceMenuProfile() {
	const {joborder_id} = useParams();
	const {data} = useServiceTypeStore();
	const {selectedEmployees} = useEmployeeStore();
	const {user} = useEmployeeRoleDetailsStore();
	if (!data) {
		return (
			<Card className="w-full p-3 flex flex-col gap-5">
				<div>
					<h3 className="text-lg font-semibold">No Selected Service</h3>
				</div>
			</Card>
		);
	}
	const avatar = (selectedEmployees ?? []).map((row) => ({
		name: `${row.employee?.firstname} ${row.employee?.middlename} ${row.employee?.lastname}`,
		link:
			typeof row.employee?.profile_link === 'string'
				? row.employee.profile_link
				: '',
	}));
	const totalAvatar = avatar.length;
	const numPeople = totalAvatar > 5 ? totalAvatar - 5 : 0;
	const processForm = async (serviceDetails: ServiceDetails) => {
		try {
			if (!user?.employee.employee_id) {
				toast.error('User is null. Cannot proceed with creating service.');
				return;
			}
			if (selectedEmployees.length <= 0) {
				toast.error('Need employee for this service');
				return;
			}
			const uuid = generateCustomUUID();
			const serviceData: Service = {
				service_type_id: data.service_type_id!,
				joborder_id: Number(joborder_id),
				total_cost_price: data.customizable_fee,
				uuid: uuid,
				fee: data.customizable_fee,
				service_status: 'Pending',
				is_returned: false,
				assigned: selectedEmployees.map((emp) => ({
					employee_id: emp.employee.employee_id,
				})),
				user_id: user.employee.employee_id,
				description: data.description,
			};
			const res = await request<ApiRequest<Service>>(
				'POST',
				`/api/v1/sms/joborder/${joborder_id}/service`,
				serviceData,
			);
			const savedServiceData: Service = Array.isArray(res.data)
				? res.data[0]
				: res.data;
			if (savedServiceData.service_id) {
				switch (data.name) {
					case 'Replacement':
						await request(
							'POST',
							`/api/v1/sms/joborder/${joborder_id}/service/${savedServiceData.service_id}/replacement-details`,
							{
								...serviceDetails,
								service_id: savedServiceData.service_id,
								user_id: user.employee.employee_id,
							},
						);
						break;
					case 'Build':
						await request(
							'POST',
							`/api/v1/sms/joborder/${joborder_id}/service/${savedServiceData.service_id}/build-details`,
							{
								...serviceDetails,
								service_id: savedServiceData.service_id,
								user_id: user.employee.employee_id,
							},
						);
						break;
					case 'Cleaning':
						await request(
							'POST',
							`/api/v1/sms/joborder/${joborder_id}/service/${savedServiceData.service_id}/cleaning-details`,
							{
								...serviceDetails,
								user_id: user.employee.employee_id,
							},
						);
						break;
					case 'Rent':
						await request(
							'POST',
							`/api/v1/sms/joborder/${joborder_id}/service/${savedServiceData.service_id}/rent-details`,
							{
								...serviceDetails,
								user_id: user.employee.employee_id,
							},
						);
						break;
					case 'Repair':
						await request(
							'POST',
							`/api/v1/sms/joborder/${joborder_id}/service/${savedServiceData.service_id}/repair-details`,
							{
								...serviceDetails,
								user_id: user.employee.employee_id,
							},
						);
						break;
					case 'Upgrade':
						await request(
							'POST',
							`/api/v1/sms/joborder/${joborder_id}/service/${savedServiceData.service_id}/upgrade-details`,
							{
								...serviceDetails,
								user_id: user.employee.employee_id,
							},
						);
						break;
					default:
						toast.error(
							'Service Details Creation Error -- service name not found',
						);
						break;
				}
			} else {
				toast.error('Error getting serviceID');
				return;
			}
			toast.success('Successfully recorded sales');
		} catch (e) {
			if (e instanceof Error) {
				toast.error(e.toString());
			} else if (e instanceof AxiosError) {
				toast.error(e.response?.data as string);
			} else {
				toast.error('An unknown error occured');
			}
			console.log(e);
		}
	};
	return (
		<div className="space-y-2">
			<Card className="p-3 flex justify-between items-center">
				<h1 className="text-lg">{data?.name}</h1>{' '}
				<div className="flex gap-3 items-center">
					{avatar.length === 0 ? (
						<span>No Empployee</span>
					) : (
						<AvatarCircles numPeople={numPeople} avatar={avatar} />
					)}
					<AddEmployeeSelection />
				</div>
			</Card>
			{data.name === 'Repair' ? (
				<p>Repair Form</p>
			) : data.name === 'Cleaning' ? (
				<Card>
					<p>Cleaning service details go here.</p>
				</Card>
			) : data.name === 'Replacement' ? (
				<Card className="p-3">
					<ReplacementForm processData={processForm} />
				</Card>
			) : data.name === 'Build' ? (
				<Card>
					<p>Build service details go here.</p>
				</Card>
			) : data.name === 'Upgrade' ? (
				<Card>
					<p>Upgrade service details go here.</p>
				</Card>
			) : data.name === 'Rent' ? (
				<Card>
					<p>Rent service details go here.</p>
				</Card>
			) : data.name === 'Reserve' ? (
				<Card>
					<p>Reserve service details go here.</p>
				</Card>
			) : (
				<Card>
					<p>No selected Service</p>
				</Card>
			)}
		</div>
	);
}
