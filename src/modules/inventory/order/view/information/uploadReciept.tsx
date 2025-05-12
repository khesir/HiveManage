import {Button} from '@/components/ui/button';
import {Order} from '@/components/validation/order';
import {useState} from 'react';
import {request} from '@/api/axios';
import {toast} from 'sonner';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {Upload} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {useParams} from 'react-router-dom';

export function UploadReceipt(order: Order) {
	const [loading, setLoading] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string | null>(
		order.delivery_receipt || null,
	);
	const [file, setFile] = useState<File | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [uploadStatus, setUploadStatus] = useState<
		'idle' | 'uploading' | 'success'
	>('idle');
	const [fileName, setFileName] = useState<string | null>(null); // Track the file name
	const {id} = useParams();
	const handleFileChange = (
		e: React.ChangeEvent<HTMLInputElement> | undefined,
	) => {
		const selected = e?.target.files?.[0];
		if (selected) {
			setFile(selected);
			setFileName(selected.name); // Set the file name

			const reader = new FileReader();
			reader.onloadend = () => {
				setSelectedImage(reader.result as string);
			};
			reader.readAsDataURL(selected);
		}
	};
	const processForm = async () => {
		if (!file) {
			toast.error('Please select a file first.');
			return;
		}
		try {
			setLoading(true);
			setUploadStatus('uploading');
			const formData = new FormData();
			formData.append('img_url', file);

			await request(
				'PATCH',
				`/api/v1/ims/order/${id}/upload-receipt`,
				formData,
			);
			toast.success('Receipt uploaded successfully!');
			setUploadStatus('success');
		} catch (error) {
			console.error(error);
			toast.error('Failed to upload receipt.');
			setUploadStatus('idle');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button>Receipt</Button>
			</PopoverTrigger>
			<PopoverContent>
				<div className="flex gap-3 flex-col">
					{selectedImage && (
						<Dialog open={showModal} onOpenChange={setShowModal}>
							<DialogTrigger asChild>
								<div className="w-full cursor-pointer">
									<img
										src={selectedImage || '/img/placeholder.png'} // default image path
										alt="Selected Receipt"
										className="w-full h-auto rounded border object-contain max-h-40"
									/>
								</div>
							</DialogTrigger>
							<DialogContent>
								<DialogTitle>Receipt Preview</DialogTitle>
								<DialogDescription>
									Here’s the uploaded receipt image.
								</DialogDescription>
								<img
									src={selectedImage || '/img/placeholder.png'}
									alt="Receipt Preview"
									className="w-full h-auto max-h-[80vh] rounded object-contain"
								/>
								{selectedImage && (
									<a
										href={selectedImage}
										download={`receipt-${order.order_id}.png`}
										className="mt-4"
										target="_blank"
										rel="noopener noreferrer"
									>
										<Button variant="outline" className="w-full">
											Download Image
										</Button>
									</a>
								)}
							</DialogContent>
						</Dialog>
					)}
					<div className="border flex items-center overflow-hidden rounded-lg p-2 gap-3">
						<input
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							className="sr-only" // Hide the default input
							id="file-input" // Add an id for referencing the custom button
						/>
						<label
							htmlFor="file-input"
							className="cursor-pointer bg-current p-1 px-3 rounded-sm transition-colors"
						>
							<Upload className="text-secondary w-4 h-4" />
						</label>
						{fileName && <Badge variant={'outline'}>{fileName}</Badge>}
					</div>
					<Button onClick={processForm} disabled={loading}>
						{uploadStatus === 'uploading'
							? 'Uploading...'
							: uploadStatus === 'success'
								? 'Successfully Uploaded'
								: file
									? 'Upload Receipt'
									: 'Upload Receipt'}
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
