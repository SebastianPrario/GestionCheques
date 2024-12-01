import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Login.page';
import SignupPage from './pages/Signup.page';
import DashBoard from './pages/DashBoard';
import 'bootstrap/dist/css/bootstrap.min.css';
import GlobalStyles from './GlobalStyles';
import OrdersView from './pages/OrdersView/OrdersView';

function App() {
  return (
    <>
      <GlobalStyles/>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/orders" element={<OrdersView />} />
      </Routes>
    </>
  );
}

export default App;
