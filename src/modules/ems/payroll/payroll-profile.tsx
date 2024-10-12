import {usePayrollStore} from '@/components/hooks/use-payroll-store';
import {Button} from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {dateParser} from '@/lib/util/utils';
import {File} from 'lucide-react';
import {useNavigate} from 'react-router-dom';

export function PayrollProfile() {
	const navigate = useNavigate();
	const {selectedPayroll} = usePayrollStore();

	return (
		<div>
			<Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
				<CardHeader className="flex flex-row items-start bg-muted/50">
					<div className="grid gap-0.5">
						<CardTitle className="group flex items-center gap-2 text-lg">
							Payroll ID : {selectedPayroll?.payroll_id}
						</CardTitle>
						<CardDescription>Payroll Date</CardDescription>
					</div>
					<div className="ml-auto flex items-center gap-1">
						<Button
							size="sm"
							variant="outline"
							className="h-8 gap-1"
							onClick={() =>
								navigate(`/ems/payroll/${selectedPayroll?.payroll_id}/details/`)
							}
						>
							<File className="h-3.5 w-3.5" />
							<span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
								View More
							</span>
						</Button>
					</div>
				</CardHeader>
				<CardContent className="p-6 text-sm">
					{selectedPayroll && (
						<div className="grid gap-3">
							<div className="font-semibold">Information</div>
							<ul className="grid gap-3">
								{/* Example data; replace with actual data from fetched info */}
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Pay Date</span>
									<span>{dateParser(selectedPayroll.pay_date)}</span>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Payroll status</span>
									<span>{selectedPayroll.status}</span>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Date Finished</span>
									<span>
										{selectedPayroll.payroll_finished
											? selectedPayroll.payroll_finished
											: 'In Progress'}
									</span>
								</li>
							</ul>
							{/* Uncomment and update for actual data */}
							{/* <Separator className="my-2" />
											<ul className="grid gap-3">
													<li className="flex items-center justify-between">
															<span className="text-muted-foreground">Subtotal</span>
															<span>$299.00</span>
													</li>
													<li className="flex items-center justify-between">
															<span className="text-muted-foreground">Shipping</span>
															<span>$5.00</span>
													</li>
													<li className="flex items-center justify-between">
															<span className="text-muted-foreground">Tax</span>
															<span>$25.00</span>
													</li>
													<li className="flex items-center justify-between font-semibold">
															<span className="text-muted-foreground">Total</span>
															<span>$329.00</span>
													</li>
											</ul> */}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
