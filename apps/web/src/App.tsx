import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { LoginPage } from '@/features/auth/pages/Login'
import { RegisterPage } from '@/features/auth/pages/Register'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { DashboardPage } from '@/features/dashboard/pages/Dashboard'
import { SchoolsPage } from '@/features/dashboard/pages/Schools'
import { CTOCornerPage } from '@/features/admin/pages/CTOCorner'
import { StudentsPage } from '@/features/school/pages/StudentsPage'
import { ClassesPage } from '@/features/school/pages/ClassesPage'
import './App.css'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  
  if (loading) return null // ou loading spinner
  
  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

import { AppLayout } from '@/layouts/AppLayout'
import { HomePage } from '@/features/home/pages/Home'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Rotas Protegidas do App Principal */}
          <Route path="/" element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }>
            <Route index element={<HomePage />} />
          </Route>

          {/* Rotas do Dashboard Administrativo */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }>
            <Route index element={<DashboardPage />} />
            <Route path="schools" element={<SchoolsPage />} />
            <Route path="settings" element={<CTOCornerPage />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="classes" element={<ClassesPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
