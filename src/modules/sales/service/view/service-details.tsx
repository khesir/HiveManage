import {Heading} from '@/components/ui/heading';
import useService from '../../_components/hooks/use-service';
import {dateParser} from '@/lib/util/utils';
import {AvatarCircles} from '@/components/ui/avatarcircles';
import {useSearchParams} from 'react-router-dom';
import TicketList from './ticket-list';
// {
//     accessorKey: '',
//     header: 'Assigned',
//     cell: ({row}) => {
//       const avatar = (row.original.assigned ?? []).map((row) => ({
//         name:
//           row.employee?.firstname ??
//           '' +
//             ' ' +
//             row.employee?.middlename +
//             '' +
//             ' ' +
//             row.employee?.lastname,
//         link:
//           typeof row.employee?.profile_link === 'string'
//             ? row.employee.profile_link
//             : '',
//       }));
//       const totalAvatar = avatar.length;
//       const numPeople = totalAvatar > 5 ? totalAvatar - 5 : 0;
//       return <AvatarCircles numPeople={numPeople} avatar={avatar} />;
//     },
//   },
export function ServiceDetails() {
	const [searchParams] = useSearchParams();
	const {data} = useService();
	const avatar = (data?.assigned ?? []).map((row) => ({
		name:
			row.employee?.firstname ??
			'' + ' ' + row.employee?.middlename + '' + ' ' + row.employee?.lastname,
		link:
			typeof row.employee?.profile_link === 'string'
				? row.employee.profile_link
				: '',
		leader: row.is_leader,
	}));
	const totalAvatar = avatar.length;
	const numPeople = totalAvatar > 5 ? totalAvatar - 5 : 0;
	const leaders = avatar.filter((person) => person.leader);

	return (
		<div className="flex flex-col sm:gap-4">
			<div className="pt-4 px-4 sm:px-6 space-y-2">
				<Heading title={'Service Information'} description={''} />
			</div>
			<div className="w-full flex flex-col gap-4 pt-0 p-4 sm:px-6">
				<div className="text-xl font-semibold">{data?.uuid}</div>
				<div className="grid grid-cols-2 gap-4 w-full">
					<div className="space-x-5">
						<span className="text-muted-foreground">Customer Name</span>
						<span>{`${data?.customer?.firstname} ${data?.customer?.lastname}`}</span>
					</div>
					<div className="space-x-5">
						<span className="text-muted-foreground">Last Updated</span>
						<span>{dateParser(data?.last_updated ?? '')}</span>
					</div>
					<div className="space-x-5">
						<span className="text-muted-foreground">Customer Contact</span>
						<span>{data?.customer?.contact_phone}</span>
					</div>
					<div className="space-x-5">
						<span className="text-muted-foreground">Total Cost</span>
						<span>P {data?.total_cost_price}</span>
					</div>
					<div className="space-x-5">
						<span className="text-muted-foreground">Job Type</span>
						<span>{data?.service_type?.name}</span>
					</div>
					<div className="space-x-5">
						<span className="text-muted-foreground">Payment Status</span>
						<span>{data?.service_status}</span>
					</div>
					<div className="space-x-5">
						<span className="text-muted-foreground">Status</span>
						<span>{data?.service_status}</span>
					</div>
					<div className="space-x-5 flex ">
						<span className="text-muted-foreground">Assigned Employees</span>
						<span className="relative">
							<div className="absolute w-[200px]">
								<AvatarCircles numPeople={numPeople} avatar={avatar} />
							</div>
						</span>
					</div>
					<div className="space-x-5">
						<span className="text-muted-foreground">Created at</span>
						<span>{dateParser(data?.created_at ?? '')}</span>
					</div>

					<div className="space-x-5">
						<span className="text-muted-foreground">Created By</span>
						<span>
							{leaders.map((p) => {
								return `${p.name}`;
							})}
						</span>
					</div>

					<div className="space-x-5 col-span-1">
						<span className="text-muted-foreground">Description</span>
						<span>{data?.description}</span>
					</div>
				</div>
				{/* Ticket List */}
				<TicketList searchParams={searchParams} />
			</div>
		</div>
	);
}
