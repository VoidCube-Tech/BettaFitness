import { lazy, type ReactNode, Suspense } from 'react'
import { BrowserRouter, HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './store/AuthContext'
import { ProductProvider } from './store/ProductContext'
import logo from './assets/images/betafitness-logo.png'

const HomePage = lazy(() => import('./pages/HomePage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const AdminProductsPage = lazy(() => import('./pages/AdminProductsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const CatalogPage = lazy(() => import('./pages/CatalogPage'))

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />
  return children
}

export default function App() {
  return <ProductProvider>
    <AuthProvider><HashRouter>
      <Suspense fallback={<div className="route-loader"><div className="route-loader__logo"><img src={logo} alt="BetaFitness moda feminina" /></div><p>Preparando sua coleção fitness…</p></div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<Navigate to="/admin/produtos" replace />} />
          <Route path="/admin/produtos" element={<ProtectedRoute><AdminProductsPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </HashRouter></AuthProvider>
  </ProductProvider>
}



