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
	ReplacementDetails,
	replacementDetailsSchema,
} from '@/components/validation/service-details';
type Props = {
	onSubmit?: () => void;
	processData?: (data: ReplacementDetails) => void;
};
export function ReplacementForm({onSubmit, processData}: Props) {
	const {user} = useEmployeeRoleDetailsStore();
	const [loading, setLoading] = useState(false);
	const {joborder_id, service_id} = useParams();
	const form = useForm<ReplacementDetails>({
		resolver: zodResolver(replacementDetailsSchema),
		defaultValues: {
			owned_items: [],
			new_product: [],
		},
		mode: 'onSubmit',
	});
	const processForm = async (data: ReplacementDetails) => {
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
			if (onSubmit) {
				onSubmit();
				return;
			}
			await request(
				'POST',
				`/api/v1/sms/joborder/${joborder_id}/service/${service_id}/replacement-details`,
				{
					...data,
					user_id: user.employee.employee_id,
				},
			);

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
					name="reason"
					render={({field}) => (
						<FormItem>
							<FormLabel>Reason</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									disabled={loading}
									placeholder="Write Reason for Replacement"
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
