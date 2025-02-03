import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStyles from './GlobalStyles';
import LoginPage from './pages/Login/Login';
import SignupPage from './pages/Signup.page';
import DashBoard from './pages/DashBoard';
import OrdersView from './pages/OrdersView/OrdersView';
import { useAuth } from './contexts/AuthContext';

const App = () => {
  const { user } = useAuth();

  return (
    <Router>
      <GlobalStyles />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={user ? <DashBoard /> : <LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/orders" element={user ? <OrdersView /> : <LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;