import {Routes as Router, Route, BrowserRouter} from 'react-router-dom';
import NotFound from './pages/_auth/_not-found';
// Layouts
import MainLayout from './components/layout/main-layout';
// Authentication
import AuthenticationPage from './pages/_auth/login';
// Admin
import {
	DashboardPage,
	EmployeeCreatePage,
	EmployeeOverviewPage,
	EmployeePage,
	EmployeePayrollPage,
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
import ChatSystem from './modules/chat/chat';
import InquiryPage from './pages/sales/systems/inquiry';
import JoborderListsPage from './pages/tech/systems/service/joborder-page';
import JoborderViewPage from './pages/tech/systems/service/joborder/view-page';
import InventoryOverview from './pages/inventory/overview/admin-overview';
import ItemPage from './pages/inventory/items/items-page';

function App() {
	return (
		<BrowserRouter>
			<Router>
				<Route index path="/" element={<AuthenticationPage />} />

				{/* Admin Layout */}
				<Route path="admin" element={<MainLayout userType={'admin'} />}>
					<Route path="dashboard" element={<DashboardPage />} />
					<Route path="chat" element={<ChatSystem />} />
					<Route path="settings" element={<Settings />} />
					<Route path="terminal" element={<Terminal />} />

					<Route path="ems">
						<Route path="overview" element={<EmployeeOverviewPage />} />

						<Route path="employees">
							<Route index element={<EmployeePage />} />
							<Route path="create" element={<EmployeeCreatePage />} />
							<Route path="update" element={<EmployeeUpdatePage />} />
							<Route path="view/:id" element={<EmployeeViewPage />} />
						</Route>

						<Route path="payroll">
							<Route index element={<EmployeePayrollPage />} />
							<Route path="payroll/:id/details" />
							<Route path="payroll/:id/create/" />
						</Route>

						<Route path="leave" />
					</Route>

					{/* Sales Layout */}
					<Route path="sales">
						<Route path="dashboard" element={<DashboardPage />} />
						<Route path="services" element={<ServicePages />} />
						<Route path="services/view/:id" element={<ViewServicePage />} />
						<Route path="services/create" element={<CreateServicePage />} />

						<Route path="customer" element={<CustomerDatabasePage />} />
						<Route path="customer/view/:id" element={<CustomerViewPage />} />
						<Route path="customer/create" element={<CustomerCreatePage />} />
						<Route path="inquiry" element={<InquiryPage />} />
					</Route>

					<Route path="inventory">
						<Route path="overview" element={<InventoryOverview />} />
						<Route path="items" element={<ItemPage />} />
						<Route path="orders" />
					</Route>
				</Route>

				{/* Technical Layout */}
				<Route path="tech" element={<MainLayout userType={'tech'} />}>
					<Route path="dashboard" element={<DashboardPage />} />
					<Route path="chat" element={<ChatSystem />} />
					<Route path="settings" element={<Settings />} />
					<Route path="terminal" element={<Terminal />} />

					{/* Systems */}
					<Route path="overview" element={<TechOverview />} />
					<Route path="services/joborders" element={<JoborderListsPage />} />
					<Route
						path="services/joborders/view/:id"
						element={<JoborderViewPage />}
					/>

					<Route path="customer" element={<CustomerDatabasePage />} />
					<Route path="customer/view/:id" element={<CustomerViewPage />} />
					<Route path="customer/create" element={<CustomerCreatePage />} />

					<Route path="inquiry" element={<InquiryPage />} />
				</Route>

				{/* TODO: Sales Layout */}
				<Route path="sales" element={<MainLayout userType={'sales'} />}>
					<Route path="dashboard" element={<SalesDashboardPage />} />
					<Route path="chat" element={<ChatSystem />} />
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

					<Route path="customer" element={<CustomerDatabasePage />} />
					<Route path="customer/view/:id" element={<CustomerViewPage />} />
					<Route path="customer/create" element={<CustomerCreatePage />} />

					<Route path="inquiry" element={<InquiryPage />} />
				</Route>
				<Route path="*" element={<NotFound />} />
			</Router>
		</BrowserRouter>
	);
}

export default App;
