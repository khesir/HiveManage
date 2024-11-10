import {Separator} from '@/components/ui/separator';
import EmployeeList from '../../employee/employee-list';
import {EmployeeProfile} from '../../employee/employee-profile';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter,
} from '@/components/ui/card';
import {Plus} from 'lucide-react';
import {useEmployeeStore} from '../../_components/hooks/use-employee-story';

export default function EmployeeSection() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const {selectedEmployee} = useEmployeeStore();

	return (
		<div className="flex flex-col sm:gap-4">
			<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
				{/* Employee List */}
				<div className="grid items-start auto-rows-max gap-4 gap md:gap-6 lg:col-span-2">
					<div className="flex flex-col gap-4">
						<Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
							<CardHeader className="pb-3">
								<CardTitle>Employee Management system</CardTitle>
								<CardDescription className="max-w-2xl text-balance leading-relaxed">
									A complete management of employees data, with a complete
									tracking for overall employee loggings
								</CardDescription>
							</CardHeader>
							<CardFooter className="space-x-3">
								<Button onClick={() => navigate('create')}>
									<Plus className="mr-2 h-4 w-4" />
									Add Employee
								</Button>
							</CardFooter>
						</Card>
					</div>
					<EmployeeList searchParams={searchParams} />
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex lg:hidden">
						<Separator />
					</div>
					{/* Employee Profile */}
					<EmployeeProfile selectedEmployee={selectedEmployee ?? null} />
				</div>
			</div>
		</div>
	);
}
