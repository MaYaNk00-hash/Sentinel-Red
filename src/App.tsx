import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ProjectDashboard from '@/pages/ProjectDashboard'
import ProjectDetailsPage from '@/pages/ProjectDetailsPage'
import ProjectUpload from '@/pages/ProjectUpload'
import ScanControlPanel from '@/pages/ScanControlPanel'
import AttackGraphPage from '@/pages/AttackGraphPage'
import VulnerabilityListPage from '@/pages/VulnerabilityListPage'
import VulnerabilityDetailPage from '@/pages/VulnerabilityDetailPage'
import ReportViewerPage from '@/pages/ReportViewerPage'
import SettingsPage from '@/pages/SettingsPage'
import { Toaster } from '@/components/ui/toaster'
import ErrorBoundary from '@/components/ErrorBoundary'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProjectDashboard />} />
          <Route path="upload" element={<ProjectUpload />} />
          <Route path="project/:projectId" element={<ProjectDetailsPage />} />
          <Route path="scan/:projectId" element={<ScanControlPanel />} />
          <Route path="attack-graph/:scanId" element={<AttackGraphPage />} />
          <Route path="vulnerabilities" element={<VulnerabilityListPage />} />
          <Route path="vulnerabilities/:id" element={<VulnerabilityDetailPage />} />
          <Route path="report/:scanId" element={<ReportViewerPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </ErrorBoundary>
  )
}

export default App
