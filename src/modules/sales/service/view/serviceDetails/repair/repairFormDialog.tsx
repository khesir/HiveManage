import {
	Form,
	FormControl,
	FormDescription,
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
	RepairDetails,
	repairDetailsSchema,
} from '@/components/validation/service-details';
type Props = {
	onSubmit?: () => void;
	processData?: (data: RepairDetails) => void;
};
export function RepairForm({onSubmit, processData}: Props) {
	const {user} = useEmployeeRoleDetailsStore();
	const [loading, setLoading] = useState(false);
	const {joborder_id, service_id} = useParams();
	const form = useForm<RepairDetails>({
		resolver: zodResolver(repairDetailsSchema),
		defaultValues: {
			parts_used: [],
		},
		mode: 'onSubmit',
	});
	const processForm = async (data: RepairDetails) => {
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
				`/api/v1/sms/joborder/${joborder_id}/service/${service_id}/repair-details`,
				{
					...data,
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
				{/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}

				<FormField
					control={form.control}
					name="diagnostic_notes"
					render={({field}) => (
						<FormItem>
							<FormLabel>Diagnostic Notes</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									disabled={loading}
									placeholder="Write Reason for Replacement"
									value={field.value ?? ''}
								/>
							</FormControl>
							<FormDescription>
								You can update notes later for changes
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="work_done"
					render={({field}) => (
						<FormItem>
							<FormLabel>Work Done</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									disabled={loading}
									placeholder="Write Reason for Replacement"
									value={field.value ?? ''}
								/>
							</FormControl>
							<FormDescription>
								Text for checklist and bullet points
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex justify-end">
					<Button type="submit" className="w-fulls">
						Submit
					</Button>
				</div>
			</form>
		</Form>
	);
}
