import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import MovieDetail from "./pages/MovieDetail";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import { AuthProvider } from "./contexts/AuthContext";
import TheaterPage from "./pages/TheaterPage";
import MoviesPage from "./pages/MoviesPage";
import BookingPage from "./pages/BookingPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PaymentSuccess from "./pages/PaymentSuccess";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movies/:id" element={<MovieDetail />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/reset-password/:oobCode"
              element={<ResetPassword />}
            />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<Account />} />
            <Route path="/theaters" element={<TheaterPage />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
