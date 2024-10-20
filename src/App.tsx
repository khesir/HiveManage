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
import {CreateServicePage} from './pages/sales/systems/subpages/create-service-page';

function App() {
	return (
		<BrowserRouter>
			<Router>
				<Route index path="/" element={<AuthenticationPage />} />

				{/* Admin Layout */}
				<Route path="admin" element={<MainLayout userType={'admin'} />}>
					<Route path="dashboard" element={<DashboardPage />} />
					<Route path="chat" />
					<Route path="settings" />
					<Route path="terminal" />

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

					<Route path="sales">
						<Route path="overview" />
						<Route path="services" />
					</Route>

					<Route path="inventory">
						<Route path="overview" />
						<Route path="items" />
						<Route path="orders" />
					</Route>
				</Route>

				{/* TODO: Technical Layout */}
				<Route path="tech" element={<MainLayout userType={'tech'} />}>
					<Route path="dashboard" element={<DashboardPage />} />
					<Route path="chat" />
					<Route path="settings" />
					<Route path="terminal" />
				</Route>

				{/* TODO: Sales Layout */}
				<Route path="sales" element={<MainLayout userType={'sales'} />}>
					<Route path="dashboard" element={<SalesDashboardPage />} />
					<Route path="chat" />
					<Route path="settings" />
					<Route path="terminal" />
					{/* Systems */}
					<Route path="overview" element={<OverviewPage />} />
					<Route path="create-service" element={<CreateServicePage />} />
					<Route path="services" element={<ServicePages />} />
					<Route path="customer" element={<CustomerDatabasePage />} />
					<Route path="inquiry" />
				</Route>
				<Route path="*" element={<NotFound />} />
			</Router>
		</BrowserRouter>
	);
}

export default App;
