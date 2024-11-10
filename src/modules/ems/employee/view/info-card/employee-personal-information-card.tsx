import {ApiRequest, request} from '@/api/axios';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {PersonalInformation} from '@/modules/ems/_components/validation/employee';
import {EmployeeRolesWithDetails} from '@/modules/ems/_components/validation/employeeRoles';
import {useEffect, useState} from 'react';

interface Props {
	selectedEmployee: EmployeeRolesWithDetails;
}
export function EmployeePersonalInformationCard({selectedEmployee}: Props) {
	const [personalInfo, setPersonalInfo] = useState<PersonalInformation>();
	const [loading, setLoading] = useState<boolean>(false);
	console.log(selectedEmployee);
	useEffect(() => {
		if (!selectedEmployee || !selectedEmployee.employee.employee_id) return; // Guard clause

		const fetchEmploymentData = async () => {
			setLoading(true);
			try {
				const response = await request<ApiRequest<PersonalInformation[]>>(
					'GET',
					`api/v1/ems/employees/${selectedEmployee.employee.employee_id}/personalInformation`,
				);
				const data = response.data as PersonalInformation[];
				console.log(data);

				if (data.length > 0) {
					setPersonalInfo(data[0]);
				} else {
					setPersonalInfo(undefined);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false); // Ensure loading is false after fetch
			}
		};

		// Call fetchEmploymentData
		fetchEmploymentData();
	}, [selectedEmployee]);
	if (loading) {
		return <Skeleton className="w-full h-full" />;
	}
	return (
		<>
			{personalInfo === undefined ? (
				<div className="flex justify-center h-full items-center">
					<Button>Add Personal Info Data</Button>
				</div>
			) : (
				<Card x-chunk="dashboard-05-chunk-3" className="gap-8 p-4 md:grid">
					<ul className="grid gap-3">
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Gender</span>
							<span>{personalInfo.sex}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Email</span>
							<span>{selectedEmployee.employee.email}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Phone</span>
							<span>{personalInfo.phone}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Birthday</span>
							<span>{personalInfo.birthday}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">AddressLine</span>
							<span>{personalInfo.address_line}</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-muted-foreground">Postal Code</span>
							<span>{personalInfo.postal_code}</span>
						</li>
					</ul>
				</Card>
			)}
			{/* 
			{isModalOpen && (
				<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Delete Item</DialogTitle>
							<DialogDescription>
								Are you sure you want to delete this item? This action cannot be
								undone.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button onClick={closeModal}>Cancel</Button>
							<Button variant="destructive" onClick={closeModal}>
								Confirm
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)} */}
		</>
	);
}
