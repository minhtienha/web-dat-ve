import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import MovieDetail from "./pages/MovieDetail";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import ManagerDashboard from "./components/manager/ManagerDashboard";
import Register from "./pages/Register";
import Account from "./pages/Account";
import { AuthProvider } from "./contexts/AuthContext";
import TheaterPage from "./pages/TheaterPage";
import MoviesPage from "./pages/MoviesPage";
import BookingPage from "./pages/BookingPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./components/admin/AdminDashboard";

function AppContent() {
  const location = useLocation();

  // Nếu path bắt đầu bằng "/admin" hoặc "/manager" thì ẩn header & footer
  const isAdminOrManagerPage =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/manager");

  return (
    <div className="App">
      {!isAdminOrManagerPage && <Header />}
      <Routes>
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
        <Route path="/theaters" element={<TheaterPage />} />
      </Routes>
      {!isAdminOrManagerPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
