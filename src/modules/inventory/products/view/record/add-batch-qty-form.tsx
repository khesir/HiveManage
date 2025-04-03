import {useSalesHook} from '@/components/hooks/use-sales-hook';
import {Button} from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {BatchItem} from '@/components/validation/inventory/batch-items';
import {zodResolver} from '@hookform/resolvers/zod';
import {Plus} from 'lucide-react';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

interface Props {
	data: BatchItem;
}

const batchFormSchema = z.object({
	quantity: z.number().min(1, 'Quantity must be at least 1'),
});
export function AddBatchQuantityForm({data}: Props) {
	const {addProduct} = useSalesHook();
	const form = useForm<z.infer<typeof batchFormSchema>>({
		resolver: zodResolver(batchFormSchema),
		defaultValues: {
			quantity: 0,
		},
		mode: 'onChange',
	});
	const [formModal, setFormModal] = useState<boolean>();
	const processForm = async (formData: z.infer<typeof batchFormSchema>) => {
		addProduct(data, formData.quantity);
		setFormModal(false);
	};

	return (
		<Dialog open={formModal} onOpenChange={setFormModal}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="w-4 h-4" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Update Order Item</DialogTitle>
				<DialogDescription></DialogDescription>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(processForm)}
						className="w-full space-y-3"
					>
						<FormField
							control={form.control}
							name={`quantity`}
							render={({field}) => (
								<FormItem>
									<FormLabel>Quantity</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="Select Value"
											value={field.value || ''}
											onChange={(e) => {
												let orderedQuantity = parseInt(e.target.value) || 0;
												if (orderedQuantity > data.quantity) {
													orderedQuantity = data.quantity;
												}
												field.onChange(orderedQuantity);
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-end">
							<Button type="submit" className="bg-green-400 hover:bg-green-400">
								Add
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
