import {Button} from '@/components/ui/button';
import {Card, CardFooter} from '@/components/ui/card';
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	Form,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {Joborder, joborderSchema} from '@/lib/sales-zod-schema';
import {zodResolver} from '@hookform/resolvers/zod';
import {useState} from 'react';
import {useForm} from 'react-hook-form';

interface JoborderProps {
	handleIsEditing: (value: string, fee: number | undefined) => void;
	fee: number;
}

export function JoborderForm({handleIsEditing, fee}: JoborderProps) {
	const [loading, setLoading] = useState<boolean>(false);
	const joborderType = [
		{
			id: 1,
			name: 'Item 1',
			description: 'Item 1',
		},
		{
			id: 2,
			name: 'Item 2',
			description: 'Item 2',
		},
		{
			id: 3,
			name: 'Item 3',
			description: 'Item 3',
		},
		{
			id: 4,
			name: 'Item 4',
			description: 'Item 4',
		},
		{
			id: 5,
			name: 'Item 5',
			description: 'Item 5',
		},
	];
	const status = [
		'Pending',
		'In Progress',
		'Completed',
		'On Hold',
		'Cancelled',
		'Awaiting Approval',
		'Approved',
		'Rejected',
		'Closed',
	];
	const processForm = (data: Joborder) => {
		// Process data here
		setLoading(true);
		console.log(data);
		setLoading(false);
	};

	const form = useForm<Joborder>({
		resolver: zodResolver(joborderSchema),
		defaultValues: {
			joborder_type_id: undefined,
			uuid: '1234',
			fee: fee,
			status: undefined,
		},
	});
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(processForm)}
				className="w-full space-y-8"
			>
				<Button onClick={() => handleIsEditing('', undefined)}>Back</Button>
				<Card className="flex flex-col">
					<div className="flex flex-col gap-3 pl-5 pt-5">
						<h1 className="font-semibold text-lg">Job order</h1>
						<p className="text-muted-foreground text-md">
							Setup joborder, to add for listing
						</p>
					</div>
					<div className="gap-8 md:grid md:grid-cols-3 p-5">
						<FormField
							control={form.control}
							name="uuid"
							render={({field}) => (
								<FormItem>
									<FormLabel>Joborder Type</FormLabel>
									<FormControl>
										<Input disabled={true} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="fee"
							render={({field}) => (
								<FormItem>
									<FormLabel>Joborder Fee</FormLabel>
									<FormControl>
										<Input disabled={true} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="joborder_type_id"
							render={({field}) => (
								<FormItem>
									<FormLabel>Joborder Type</FormLabel>
									<Select
										disabled={loading}
										onValueChange={(value) => field.onChange(Number(value))}
										value={field.value ? field.value.toString() : ''}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													defaultValue={field.value}
													placeholder="Select a type"
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{joborderType.map((jo) => (
												<SelectItem key={jo.id} value={jo.id.toString()}>
													{jo.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="status"
							render={({field}) => (
								<FormItem>
									<FormLabel>Joborder Status</FormLabel>
									<Select
										disabled={loading}
										onValueChange={field.onChange}
										value={field.value ? field.value.toString() : ''}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													defaultValue={field.value}
													placeholder="Select a status"
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{status.map((data, index) => (
												<SelectItem key={index} value={data}>
													{data}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<CardFooter className="flex justify-end">
						<Button type="submit">Submit</Button>
					</CardFooter>
				</Card>
			</form>
		</Form>
	);
}
