import {useState} from 'react';
import useServiceTypeStore from './_components/use-serviceType-hook';
import {Customer} from '@/components/validation/customer';
import {SearchCustomer} from '../dashboard/customer/search-customer';
import {Card} from '@/components/ui/card';
import {AddEmployeeSelection} from './_components/dialogue/employee-selection';
import useEmployeeStore from './_components/use-employee-list-hook';
import {AvatarCircles} from '@/components/ui/avatarcircles';
import {Button} from '@/components/ui/button';
import {CreateService} from '@/api/service-api';
import {toast} from 'sonner';
import {Service} from '@/components/validation/service';
import {useEmployeeRoleDetailsStore} from '@/modules/authentication/hooks/use-sign-in-userdata';
import {generateCustomUUID} from '@/lib/util/utils';

export function ServiceMenuProfile() {
	const {data} = useServiceTypeStore();
	const [customer, setCustomer] = useState<Customer>();
	const [loading, setLoading] = useState<boolean>(false);
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
	const processForm = async () => {
		try {
			setLoading(true);
			if (!customer) {
				toast.error('Please select a customer');
				return;
			}
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
				customer_id: customer.customer_id,
				total_cost_price: data.customizable_fee,
				uuid: uuid,
				fee: data.customizable_fee,
				service_status: 'Pending',
				assigned: selectedEmployees.map((emp) => ({
					employee_id: emp.employee.employee_id,
				})),
				user_id: user.employee.employee_id,
				description: data.description,
			};
			await CreateService(serviceData);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-2">
			<Card className="p-3 flex justify-between items-center">
				<h1 className="text-lg">{data?.name}</h1>{' '}
				<div className="flex gap-3 items-center">
					{avatar.length === 0 ? (
						<span>No suppliers</span>
					) : (
						<AvatarCircles numPeople={numPeople} avatar={avatar} />
					)}
					<AddEmployeeSelection />
				</div>
			</Card>
			<Card className="w-full p-5 flex flex-col gap-5">
				{Object.keys(customer ?? {}).length === 0 ? (
					<div>
						<h3 className="text-lg font-semibold">No Customer Selected</h3>
						<p>Please select or create a customer to proceed.</p>
					</div>
				) : (
					<div>
						<h3 className="text-lg font-semibold">{`#${customer?.customer_id} ${customer?.firstname} ${customer?.middlename} ${customer?.lastname}`}</h3>
						<p>{customer?.contact_phone}</p>
					</div>
				)}
			</Card>
			<SearchCustomer processCreate={setCustomer} showTitle={false} />
			<Button onClick={processForm} disabled={loading} className="w-full">
				Submit
			</Button>
		</div>
	);
}
