import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Layout } from '@/components/layout/Layout';

import { LoginPage } from '@/pages/login/LoginPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { ProjectsListPage } from '@/pages/projects/ProjectsListPage';
import { WorkOrdersListPage } from '@/pages/workOrders/WorkOrdersListPage';
import { CustomersListPage } from '@/pages/customers/CustomersListPage';
import { WorkersListPage } from '@/pages/workers/WorkersListPage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes wrapped in Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/projects" element={<ProjectsListPage />} />
              <Route path="/work-orders" element={<WorkOrdersListPage />} />
              <Route path="/customers" element={<CustomersListPage />} />
              <Route path="/workers" element={<WorkersListPage />} />
            </Route>
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
