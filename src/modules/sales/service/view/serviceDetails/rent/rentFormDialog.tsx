import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useEmployeeRoleDetailsStore} from '@/modules/authentication/hooks/use-sign-in-userdata';
import {toast} from 'sonner';
import {AxiosError} from 'axios';
import {useState} from 'react';
import {useParams} from 'react-router-dom';
import {request} from '@/api/axios';
import {Button} from '@/components/ui/button';
import {
	RentDetails,
	rentDetailsSchema,
} from '@/components/validation/service-details';
import {Input} from '@/components/ui/input';
import {useServiceDetails} from '../../../_components/use-service-details-hook';
import {Switch} from '@/components/ui/switch';
type Props = {
	onSubmit?: () => void;
	processData?: (data: RentDetails) => void;
};
export function RentForm({onSubmit, processData}: Props) {
	const {serviceDetails} = useServiceDetails();
	const {user} = useEmployeeRoleDetailsStore();
	const [loading, setLoading] = useState(false);
	const {joborder_id, service_id} = useParams();
	const form = useForm<RentDetails>({
		resolver: zodResolver(rentDetailsSchema),
		defaultValues: {
			rented_items: [],
			start_date: (serviceDetails as RentDetails)?.start_date ?? '',
			end_date: (serviceDetails as RentDetails)?.end_date ?? '',
			deposit: (serviceDetails as RentDetails)?.deposit,
			returned: (serviceDetails as RentDetails)?.returned,
		},
		mode: 'onSubmit',
	});
	const processForm = async (data: RentDetails) => {
		if (!user?.employee.employee_id) {
			toast.error('Must be login to process');
			return;
		}
		try {
			setLoading(true);
			if (processData) {
				processData(data);
				return;
			}
			await request(
				'POST',
				`/api/v1/sms/joborder/${joborder_id}/service/${service_id}/rent-details`,
				{
					...data,
					user_id: user.employee.employee_id,
				},
			);
			if (onSubmit) {
				onSubmit();
				return;
			}
			toast.success('Successfully created Rent details');
		} catch (e) {
			if (e instanceof Error) {
				toast.error(e.toString());
			} else if (e instanceof AxiosError) {
				toast.error(e.response?.data as string);
			} else {
				toast.error('An Unknown error occured');
			}
		} finally {
			setLoading(false);
		}
	};
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(processForm)}
				className="w-full space-y-2 h-full"
			>
				<FormField
					control={form.control}
					name="start_date"
					render={({field}) => (
						<FormItem>
							<FormLabel>Start Date</FormLabel>
							<FormControl>
								<Input
									type="date"
									disabled={loading}
									placeholder="John"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="end_date"
					render={({field}) => (
						<FormItem>
							<FormLabel>End Date</FormLabel>
							<FormControl>
								<Input
									type="date"
									disabled={loading}
									placeholder="John"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="deposit"
					render={({field}) => (
						<FormItem>
							<FormLabel>Deposit</FormLabel>
							<FormControl>
								<Input
									type="number"
									{...field}
									disabled={loading}
									placeholder="Enter Deposit"
									onChange={(e) => {
										const value = e.target.value;
										// Ensure the value is converted to a number
										field.onChange(value ? parseFloat(value) : null);
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="returned"
					render={({field}) => (
						<FormItem className="flex items-center gap-2">
							<FormLabel>Returned</FormLabel>
							<FormControl>
								<Switch
									checked={!!field.value}
									onCheckedChange={field.onChange}
									aria-readonly
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex justify-end">
					<Button type="submit">Submit</Button>
				</div>
			</form>
		</Form>
	);
}
