import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {EmployeeRolesWithDetails} from '@/modules/ems/_components/validation/employeeRoles';
import {EmployeeInformationCard} from './employee-information-card';
import {EmployeeEmploymentInformationCard} from './employee-employment-information-card';
import {EmployeePersonalInformationCard} from './employee-personal-information-card';
interface Props {
	selectedEmployee: EmployeeRolesWithDetails;
}
export function EmployeInforTabs({selectedEmployee}: Props) {
	return (
		<Tabs defaultValue="Base" className="h-full">
			<div className="flex items-center">
				<TabsList className="flex w-full">
					<TabsTrigger value="Base" className="flex-1">
						Base
					</TabsTrigger>
					<TabsTrigger value="Personal" className="flex-1">
						Personal
					</TabsTrigger>
					<TabsTrigger value="Employment" className="flex-1">
						Employment
					</TabsTrigger>
				</TabsList>
				{/* Possibly add a marquee here for announcements or something */}
			</div>
			<TabsContent value="Base" className="h-[250px]">
				<EmployeeInformationCard selectedEmployee={selectedEmployee} />
			</TabsContent>
			<TabsContent value="Personal" className="h-[250px]">
				<EmployeePersonalInformationCard selectedEmployee={selectedEmployee} />
			</TabsContent>
			<TabsContent value="Employment" className="h-[250px]">
				<EmployeeEmploymentInformationCard
					selectedEmployee={selectedEmployee}
				/>
			</TabsContent>
		</Tabs>
	);
}
