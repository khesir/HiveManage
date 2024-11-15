import {Routes as Router, Route, BrowserRouter} from 'react-router-dom';
import NotFound from './pages/_auth/_not-found';
// Layouts
import MainLayout from './components/appLayout/main-layout';
// Authentication
import AuthenticationPage from './pages/_auth/login';
// Admin
import {
	DashboardPage,
	EmployeeCreatePage,
	EmployeeUpdatePage,
	EmployeeViewPage,
} from './pages/admin';

import {
	CustomerDatabasePage,
	OverviewPage,
	SalesDashboardPage,
	ServicePages,
} from './pages/sales';

// TODO: Sort this to each index found in root of page file index.ts
import {CreateServicePage} from './pages/sales/systems/overview/create-service-page';
import ViewServicePage from './pages/sales/systems/service/view-service-page';
import CustomerCreatePage from './pages/sales/systems/customer/customer-create-page';
import CustomerViewPage from './pages/sales/systems/customer/customer-view-page';
import TechOverview from './pages/tech/systems/overview/overview-page';
import Settings from './pages/general/settings';
import Terminal from './pages/general/terminal';
import InquiryPage from './pages/sales/systems/inquiry';
import JoborderListsPage from './pages/tech/systems/service/joborder-page';
import JoborderViewPage from './pages/tech/systems/service/view/view-page';
import ItemPage from './pages/inventory/items/items-page';
import ReadTask from './pages/sales/systems/service/tickets/task-detail';
import TicketsPage from './pages/tech/systems/service/task-page';
import ReportsPage from './pages/tech/systems/service/reports-page';
import RequireAuth from './modules/authentication/auth-layout';
import Unauthorized from './pages/_auth/unauthorized';
import EmployeePage from './pages/admin/systems/ems/employee-page';
import ProductPage from './pages/inventory/overview/prouct-page';

function App() {
	return (
		<BrowserRouter>
			<Router>
				<Route index path="/" element={<AuthenticationPage />} />

				{/* Admin Layout */}
				<Route path="admin" element={<MainLayout userType={'admin'} />}>
					<Route element={<RequireAuth allowedRoles={['Admin']} />}>
						<Route path="dashboard" element={<DashboardPage />} />
						<Route path="settings" element={<Settings />} />
						<Route path="terminal" element={<Terminal />} />

						<Route path="ems">
							<Route path="employees">
								<Route index element={<EmployeePage />} />
								<Route path="create" element={<EmployeeCreatePage />} />
								<Route path="update" element={<EmployeeUpdatePage />} />
								<Route path="view/:id" element={<EmployeeViewPage />} />
							</Route>
						</Route>
						<Route path="sales">
							<Route path="dashboard" element={<DashboardPage />} />
							<Route path="services" element={<ServicePages />} />
							<Route path="services/view/:id" element={<ViewServicePage />} />
							<Route path="services/create" element={<CreateServicePage />} />
							<Route
								path="services/joborders/view/:id"
								element={<JoborderViewPage />}
							/>
							<Route
								path="services/joborders/view/:id/task/:task_id"
								element={<ReadTask />}
							/>
							<Route path="services/joborders/view/:id/report" />
							<Route path="customer" element={<CustomerDatabasePage />} />
							<Route path="customer/view/:id" element={<CustomerViewPage />} />
							<Route path="customer/create" element={<CustomerCreatePage />} />
							<Route path="inquiry" element={<InquiryPage />} />
						</Route>

						<Route path="inventory">
							<Route path="products" element={<ProductPage />} />
							<Route path="items" element={<ItemPage />} />
							<Route path="orders" />
						</Route>
					</Route>
				</Route>

				{/* Technical Layout */}
				<Route path="tech" element={<MainLayout userType={'tech'} />}>
					<Route element={<RequireAuth allowedRoles={['Technician']} />}>
						<Route path="dashboard" element={<DashboardPage />} />
						<Route path="settings" element={<Settings />} />
						<Route path="terminal" element={<Terminal />} />

						{/* Systems */}
						<Route path="services">
							<Route path="overview" element={<TechOverview />} />
							{/* Joborder */}
							<Route path="joborders">
								<Route index element={<JoborderListsPage />} />
								<Route path="view/:id" element={<JoborderViewPage />} />
								{/* Tickets */}
								<Route path="tasks">
									<Route index element={<TicketsPage />} />
									<Route path="view/:task_id" element={<ReadTask />} />
								</Route>
								{/* Report route */}
								<Route path="reports">
									<Route index element={<ReportsPage />} />
									<Route path="view/:report_id" />
								</Route>
							</Route>
						</Route>

						<Route path="customer">
							<Route index element={<CustomerDatabasePage />} />
							<Route path="view/:customer_id" element={<CustomerViewPage />} />
							<Route path="create" element={<CustomerCreatePage />} />
						</Route>

						<Route path="inquiry" element={<InquiryPage />} />
					</Route>
				</Route>

				{/* TODO: Sales Layout */}
				<Route path="sales" element={<MainLayout userType={'sales'} />}>
					<Route element={<RequireAuth allowedRoles={['Sales']} />}>
						<Route path="dashboard" element={<SalesDashboardPage />} />
						<Route path="settings" element={<Settings />} />
						<Route path="terminal" element={<Terminal />} />
						{/* Systems */}
						<Route path="overview" element={<OverviewPage />} />
						<Route path="create-service" element={<CreateServicePage />} />

						<Route path="services" element={<ServicePages />} />
						<Route path="services/view/:id" element={<ViewServicePage />} />
						<Route path="services/create" element={<CreateServicePage />} />
						<Route
							path="services/joborders/view/:id"
							element={<JoborderViewPage />}
						/>
						<Route
							path="services/joborders/view/:id/task/:task_id"
							element={<ReadTask />}
						/>
						<Route path="services/joborders/view/:id/report" />

						<Route path="customer" element={<CustomerDatabasePage />} />
						<Route path="customer/view/:id" element={<CustomerViewPage />} />
						<Route path="customer/create" element={<CustomerCreatePage />} />

						<Route path="inquiry" element={<InquiryPage />} />
					</Route>
				</Route>
				<Route path="*" element={<NotFound />} />
				<Route path="unauthorized" element={<Unauthorized />} />
			</Router>
		</BrowserRouter>
	);
}

export default App;
