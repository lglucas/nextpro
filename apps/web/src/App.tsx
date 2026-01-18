import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { AuthProvider } from '@/contexts/AuthProvider'
import { LoginPage } from '@/features/auth/pages/Login'
import { RegisterPage } from '@/features/auth/pages/Register'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { DashboardPage } from '@/features/dashboard/pages/Dashboard'
import { DashboardIndexPage } from '@/features/dashboard/pages/DashboardIndexPage'
import { OperationsHomePage } from '@/features/dashboard/pages/OperationsHomePage'
import { PartnerDashboardPage } from '@/features/dashboard/pages/PartnerDashboardPage'
import { SchoolsPage } from '@/features/dashboard/pages/Schools'
import { PreCadastrosPage } from '@/features/dashboard/pages/PreCadastros'
import { CTOCornerPage } from '@/features/admin/pages/CTOCorner'
import { StudentsPage } from '@/features/school/pages/StudentsPage'
import { ClassesPage } from '@/features/school/pages/ClassesPage'
import { ClassAttendancePage } from '@/features/school/pages/ClassAttendancePage'
import { PostTrainingEvaluationPage } from '@/features/school/pages/PostTrainingEvaluationPage'
import { SessionTechnicalSummaryPage } from '@/features/school/pages/SessionTechnicalSummaryPage'
import { ClassMonthlyEvaluationPage } from '@/features/school/pages/ClassMonthlyEvaluationPage'
import { StudentCardPage } from '@/features/school/pages/StudentCardPage'
import { PublicSiteLayout } from '@/layouts/PublicSiteLayout'
import { SiteHomePage } from '@/features/site/pages/SiteHomePage'
import { ProjetoPage } from '@/features/site/pages/ProjetoPage'
import { PaisPage } from '@/features/site/pages/PaisPage'
import { AtletasPage } from '@/features/site/pages/AtletasPage'
import { EscolinhasPage } from '@/features/site/pages/EscolinhasPage'
import { ComoFuncionaPage } from '@/features/site/pages/ComoFuncionaPage'
import { FAQPage } from '@/features/site/pages/FAQPage'
import { ContatoPage } from '@/features/site/pages/ContatoPage'
import { TermosPage } from '@/features/site/pages/TermosPage'
import { PrivacidadePage } from '@/features/site/pages/PrivacidadePage'
import { BlogPage } from '@/features/site/pages/BlogPage'
import { ParceirosPage } from '@/features/site/pages/ParceirosPage'
import { PreCadastroPage } from '@/features/site/pages/PreCadastroPage'
import { TermsGate } from '@/features/legal/components/TermsGate'
import { AceiteTermosPage } from '@/features/legal/pages/AceiteTermosPage'
import './App.css'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  
  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <p className="text-sm text-slate-600">Carregando…</p>
      </div>
    )
  
  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

import { AppLayout } from '@/layouts/AppLayout'
import { HomePage } from '@/features/home/pages/Home'
import { MeuPerfilPage } from '@/features/profile/pages/MeuPerfilPage'
import { CheckInPage } from '@/features/attendance/pages/CheckInPage'
import { TechnicalHistoryPage } from '@/features/technical/pages/TechnicalHistoryPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicSiteLayout />}>
            <Route index element={<SiteHomePage />} />
            <Route path="projeto" element={<ProjetoPage />} />
            <Route path="pais" element={<PaisPage />} />
            <Route path="atletas" element={<AtletasPage />} />
            <Route path="escolinhas" element={<EscolinhasPage />} />
            <Route path="como-funciona" element={<ComoFuncionaPage />} />
            <Route path="faq" element={<FAQPage />} />
            <Route path="contato" element={<ContatoPage />} />
            <Route path="termos" element={<TermosPage />} />
            <Route path="privacidade" element={<PrivacidadePage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="parceiros" element={<ParceirosPage />} />
            <Route path="pre-cadastro" element={<PreCadastroPage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Rotas Protegidas do App Principal */}
          <Route path="/app" element={
            <PrivateRoute>
              <TermsGate>
                <AppLayout />
              </TermsGate>
            </PrivateRoute>
          }>
            <Route index element={<HomePage />} />
            <Route path="meu-perfil" element={<MeuPerfilPage />} />
            <Route path="tecnico" element={<TechnicalHistoryPage />} />
            <Route path="check-in" element={<CheckInPage />} />
            <Route path="aceite-termos" element={<AceiteTermosPage />} />
          </Route>

          {/* Rotas do Dashboard Administrativo */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <TermsGate>
                <DashboardLayout />
              </TermsGate>
            </PrivateRoute>
          }>
            <Route index element={<DashboardIndexPage />} />
            <Route path="overview" element={<DashboardPage />} />
            <Route path="operacao" element={<OperationsHomePage />} />
            <Route path="partner" element={<PartnerDashboardPage />} />
            <Route path="schools" element={<SchoolsPage />} />
            <Route path="settings" element={<CTOCornerPage />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="students/:id/card" element={<StudentCardPage />} />
            <Route path="classes" element={<ClassesPage />} />
            <Route path="pre-cadastros" element={<PreCadastrosPage />} />
            <Route path="classes/:id/attendance" element={<ClassAttendancePage />} />
            <Route path="classes/:id/sessions/:sessionId/post-treino" element={<PostTrainingEvaluationPage />} />
            <Route path="classes/:id/sessions/:sessionId/resumo-tecnico" element={<SessionTechnicalSummaryPage />} />
            <Route path="classes/:id/avaliacao-mensal" element={<ClassMonthlyEvaluationPage />} />
            <Route path="attendance" element={<Navigate to="/dashboard/classes" replace />} />
            <Route path="reports" element={<Navigate to="/dashboard/overview" replace />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
