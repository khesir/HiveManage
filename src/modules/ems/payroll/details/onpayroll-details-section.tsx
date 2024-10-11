export type paramsProps = {
	searchParams: URLSearchParams;
};

export default function OnPayrollDetails(data: paramsProps) {
	return (
		<div className="flex flex-col gap-4">
			<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 lg:grid-cols-4 xl:grid-cols-4">
				<div className="grid items-start auto-rows-max gap-4 md:gap-6 lg:col-span-2">
					{/* Employee Overall Payroll Reports */}
				</div>
				<div className="grid items-start auto-rows-max gap-4 md:gap-6 lg:col-span-2">
					{/* Employee Table */}
					test
				</div>
			</div>
		</div>
	);
}
