import {ContentLayout} from '@/components/layout/content-layout';
import {Breadcrumbs} from '@/components/ui/breadcrumbs';
import {Heading} from '@/components/ui/heading';
import {Task, TaskCard} from '@/modules/task/task';

const breadcrubItems = [{title: 'Dashboard', link: 'admin/dashboard'}];
const tasks: Task[] = [
	{
		module: 'Employee',
		status: 'Urgent & Important',
		taskList: [
			'Overview',
			'Employees-listing',
			'Employee-create',
			'Employee-view',
			'Employee-update',
			'Payroll-listing',
			'Payroll-create',
			'Payroll-update',
			'Payroll-Overall-view',
			'Payroll Adjustments',
			'Payroll Confirmations',
			'Payroll Export CSV',
			'Payroll Print Payslip',
		],
		button: {
			link: '/employee',
			variant: 'default',
		},
	},
	{
		module: 'Finance',
		status: 'Important',
		taskList: ['Budget Planning', 'Expense Tracking', 'Review Reports'],
		button: {
			link: '/finance',
			variant: 'default',
		},
	},
	{
		module: 'Inventory',
		status: 'Urgent',
		taskList: ['Stock Check', 'Order Supplies', 'Update Inventory'],
		button: {
			link: '/inventory',
			variant: 'default',
		},
	},
	{
		module: 'Sales',
		status: 'Normal',
		taskList: ['Review Sales Data', 'Update Pricing', 'Customer Feedback'],
		button: {
			link: '/sales',
			variant: 'default',
		},
	},
];

export default function DashboardPage() {
	return (
		<ContentLayout title={'PC BEE Management Systems'}>
			<Breadcrumbs items={breadcrubItems} />
			<Heading
				title={'Modules'}
				description={'List of all modules that need to be coded'}
			/>
			<div className="grid grid-cols-2 gap-5">
				{tasks.map((task, index) => (
					<TaskCard key={index} task={task} />
				))}
			</div>
		</ContentLayout>
	);
}
