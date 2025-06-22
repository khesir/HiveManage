import {Button} from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {useState} from 'react';
import {SalesReport} from './sales-reports';
export function SalesReportDialog() {
	const [formModal, setFormModal] = useState<boolean>(false);
	return (
		<Dialog open={formModal} onOpenChange={setFormModal}>
			<DialogTrigger asChild>
				<Button className="flex items-center gap-1">View Sales Report</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[50vh]">
				<DialogTitle>Sales Report</DialogTitle>
				<DialogDescription></DialogDescription>
				{/* <ServiceCharts /> */}
				<SalesReport />
			</DialogContent>
		</Dialog>
	);
}
