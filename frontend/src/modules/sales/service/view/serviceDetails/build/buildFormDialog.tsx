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
import {Textarea} from '@/components/ui/textarea';
import {toast} from 'sonner';
import {AxiosError} from 'axios';
import {useState} from 'react';
import {useParams} from 'react-router-dom';
import {request} from '@/api/axios';
import {Button} from '@/components/ui/button';
import {
	BuildDetails,
	buildDetailsSchema,
} from '@/components/validation/service-details';
import {useServiceDetails} from '../../../_components/use-service-details-hook';
type Props = {
	onSubmit?: () => void;
	processData?: (data: BuildDetails) => void;
};
export function BuildForm({onSubmit, processData}: Props) {
	const {serviceDetails} = useServiceDetails();
	const {user} = useEmployeeRoleDetailsStore();
	const [loading, setLoading] = useState(false);
	const {joborder_id, service_id} = useParams();
	const form = useForm<BuildDetails>({
		resolver: zodResolver(buildDetailsSchema),
		defaultValues: {
			customer_items: [],
			parts_used: [],
			build_specs: (serviceDetails as BuildDetails)?.build_specs ?? '',
			checklist: (serviceDetails as BuildDetails)?.checklist ?? '',
		},
		mode: 'onSubmit',
	});
	const processForm = async (data: BuildDetails) => {
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
				`/api/v1/sms/joborder/${joborder_id}/service/${service_id}/build-details`,
				{
					...data,
					service_id: Number(service_id),
					user_id: user.employee.employee_id,
				},
			);

			if (onSubmit) {
				onSubmit();
				return;
			}
			toast.success('Successfully created replacement details');
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
					name="build_specs"
					render={({field}) => (
						<FormItem>
							<FormLabel>Build Specs</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									disabled={loading}
									placeholder="Spec builds"
									value={field.value ?? ''}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="checklist"
					render={({field}) => (
						<FormItem>
							<FormLabel>Checklist</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									disabled={loading}
									placeholder="[X] Check List"
									value={field.value ?? ''}
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
