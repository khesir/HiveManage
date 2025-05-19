import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {zodResolver} from '@hookform/resolvers/zod';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {useParams} from 'react-router-dom';
import {Button} from '@/components/ui/button';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	OwnedItems,
	ownedItemsSchema,
} from '@/components/validation/owned-items';
import {request} from '@/api/axios';
import {toast} from 'sonner';
import {AxiosError} from 'axios';

export function OwnedItemDialog() {
	const [formModal, setFormModal] = useState<boolean>(false);
	const handleSubmit = () => {
		setFormModal(false);
	};
	return (
		<Dialog open={formModal} onOpenChange={setFormModal}>
			<DialogTrigger asChild>
				<Button className="flex items-center gap-1">Add Items</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[100vh]">
				<DialogTitle className="flex gap-2 items-center">
					Owned Item
				</DialogTitle>
				<DialogDescription></DialogDescription>
				<OwnedItemForm onSubmit={handleSubmit} />
			</DialogContent>
		</Dialog>
	);
}
type Props = {
	onSubmit: () => void;
};
export function OwnedItemForm({onSubmit}: Props) {
	const [loading, setLoading] = useState<boolean>(false);
	const {service_id, joborder_id} = useParams();
	const form = useForm<OwnedItems>({
		resolver: zodResolver(ownedItemsSchema),
		defaultValues: {
			service_id: Number(service_id),
		},
		mode: 'onSubmit',
	});

	const processForm = async (formData: OwnedItems) => {
		setLoading(true);
		try {
			await request(
				'POST',
				`/api/v1/sms/joborder/${joborder_id}/service/${service_id}/owned-items`,
				formData,
			);
			if (onSubmit) {
				onSubmit();
			}

			toast.success('Added items to cart');
		} catch (e) {
			if (e instanceof Error) {
				toast.error(e.toString());
			} else if (e instanceof AxiosError) {
				toast.error(e.response?.data as string);
			} else {
				toast.error('An unknown error occured');
			}
			console.log(e);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center h-full items-center">loading..</div>
		);
	}

	return (
		<div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(processForm)}
					className="space-y-4 flex flex-col md:flex-row gap-5"
				>
					<div className="flex-[50%] space-y-3">
						<FormField
							control={form.control}
							name="name"
							render={({field}) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											{...field}
											disabled={loading}
											placeholder="Owned Item data"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="item_description"
							render={({field}) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											className="md:h-[10vh]"
											{...field}
											value={field.value ?? ''}
											disabled={loading}
											placeholder="What is this OwnedItems about?"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="serial_number"
							render={({field}) => (
								<FormItem>
									<FormLabel>Serial Number</FormLabel>
									<FormControl>
										<Input
											{...field}
											disabled={loading}
											placeholder="EXP-1234"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="brand"
							render={({field}) => (
								<FormItem>
									<FormLabel>Brand</FormLabel>
									<FormControl>
										<Input
											{...field}
											disabled={loading}
											placeholder="e.g. Apple"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="model"
							render={({field}) => (
								<FormItem>
									<FormLabel>Model</FormLabel>
									<FormControl>
										<Input
											{...field}
											disabled={loading}
											placeholder="Model: 1234-1234"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="notes"
							render={({field}) => (
								<FormItem>
									<FormLabel>Notes</FormLabel>
									<FormControl>
										<Textarea
											className="md:h-[10vh]"
											{...field}
											disabled={loading}
											placeholder="What is this OwnedItems about?"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full">
							Submit
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
