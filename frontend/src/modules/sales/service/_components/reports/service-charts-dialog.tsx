import {Button} from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {useState} from 'react';
import {ServiceReports} from './service-reports';
export function ServiceChartsDialog() {
	const [formModal, setFormModal] = useState<boolean>(false);
	return (
		<Dialog open={formModal} onOpenChange={setFormModal}>
			<DialogTrigger asChild>
				<Button className="flex items-center gap-1">
					View Joborder Report
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[50vh]">
				<DialogTitle>Joborder Report</DialogTitle>
				<DialogDescription></DialogDescription>
				{/* <ServiceCharts /> */}
				<ServiceReports />
			</DialogContent>
		</Dialog>
	);
}
