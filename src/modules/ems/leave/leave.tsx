import {ContentLayout} from '@/app/_components/layout/general/content-layout';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {Link} from 'react-router-dom';
import Cookies from 'js-cookie';
import {useState, useEffect} from 'react';
import {Mail} from './mail';
import {mails} from './data';

export default function LeavePage() {
	const [defaultLayout, setDefaultLayout] = useState<any>();
	const [defaultCollapsed, setDefaultCollapsed] = useState<any>();

	useEffect(() => {
		const layout = Cookies.get('react-resizable-panels:layout:mail');
		const collapsed = Cookies.get('react-resizable-panels:collapsed');

		setDefaultLayout(layout ? JSON.parse(layout) : undefined);
		setDefaultCollapsed(collapsed ? JSON.parse(collapsed) : undefined);
	}, []);
	return (
		<ContentLayout title="Employee Management System">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link to="/dashboard">Dashboard</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link to="/ems/overview">EMS</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link to="/ems/overview">Overview</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Leave</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<Mail
				mails={mails}
				defaultLayout={defaultLayout}
				defaultCollapsed={defaultCollapsed}
				navCollapsedSize={4}
			/>{' '}
		</ContentLayout>
	);
}
