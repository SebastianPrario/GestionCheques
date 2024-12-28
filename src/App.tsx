import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Login/Login';
import SignupPage from './pages/Signup.page';
import DashBoard from './pages/DashBoard';
import 'bootstrap/dist/css/bootstrap.min.css';
import GlobalStyles from './GlobalStyles';
import OrdersView from './pages/OrdersView/OrdersView';


function App() {
  const user = localStorage.getItem('token')
 
  return (
    <>
      <GlobalStyles/>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={ user ? <DashBoard /> : <LoginPage /> } />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/orders" element={user ? <OrdersView /> : <LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
