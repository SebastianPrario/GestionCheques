import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/Login/Login'
import SignupPage from './pages/Signup.page'
import DashBoard from './pages/DashBoard'
import 'bootstrap/dist/css/bootstrap.min.css'
import GlobalStyles from './GlobalStyles'
import OrdersView from './pages/OrdersView/OrdersView'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'

function App() {
    return (
        <>
            <GlobalStyles />
            <Routes>
                {/* Rutas Publicas */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Rutas Protegidas*/}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<DashBoard />} />
                    <Route path="/orders" element={<OrdersView />} />
                </Route>
                {/* Redirección por defecto */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    )
}

export default App
