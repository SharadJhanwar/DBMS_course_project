import { BrowserRouter as Router, Routes, Route, useLocation,useParams } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MenuPage from "./pages/MenuPage";
import AdminMenuPage from "./pages/AdminMenuPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import CheckoutPage from "./pages/CheckoutPage"
import OrdersPage from "./pages/OrdersPage";
import AdminOrderManage from "./pages/AdminOrderManage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import StatsDashboard from "./pages/StatsDashboard";
import TopSellingItem from "./pages/TopSellingItem";
import CustomerStats from "./pages/CustomerStats";
import CustomerStatsSearch from "./pages/CustomerStatsSearch";



import ProtectedRoute from "./components/ProtectedRoute";

import { AuthProvider } from "./context/AuthContext";

export default function App() {
  const location = useLocation();

  const noHeaderFooterRoutes = ["/signup", "/login"];

  const hide = noHeaderFooterRoutes.includes(location.pathname);
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        {!hide && <Header />}
        <main className="grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected Routes */}
            <Route
              path="/admin"
              element={<>HELLO</>}
            />
            <Route
              path="/admin/menu"
              element={
                <ProtectedRoute role="admin">
                  <AdminMenuPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute role="admin">
                  <AdminOrderManage />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/stats" element={<ProtectedRoute role="admin">
                  <StatsDashboard />
                </ProtectedRoute>} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/top-item"
              element={
                <ProtectedRoute role="admin">
                  <TopSellingItem />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/customer-stats" element={
              <ProtectedRoute role="admin">
                  <CustomerStatsSearch />
                </ProtectedRoute>
            } />

            <Route
              path="/admin/customer-stats/:userId"
              element={
                <ProtectedRoute role="admin">
                  <CustomerStats />
                </ProtectedRoute>
              }
            />
            <Route path="/menu" element={
              <ProtectedRoute role="customer"><div><MenuPage /></div></ProtectedRoute>
            } />

            <Route path='/cart' element={
              <ProtectedRoute role='customer'><CartPage /></ProtectedRoute>
            }
            />

            <Route path='/profile' element={
              <ProtectedRoute role='customer'><ProfilePage /></ProtectedRoute>
            } />

            <Route path='/checkout' element={
              <ProtectedRoute role='customer'>
                <CheckoutPage />
              </ProtectedRoute>
            } />

            <Route path='/orders' element={
              <ProtectedRoute role='customer'>
                <OrdersPage />
              </ProtectedRoute>
            } />

            <Route path="/orders/:id" element={
              <ProtectedRoute role='customer'>
                <OrderDetailsPage />
              </ProtectedRoute>
            } />

            <Route
              path="/user"
              element={<ProtectedRoute role="customer"><UserDashboard /></ProtectedRoute>}
            />



          </Routes>
        </main>
        {!hide && <Footer />}
      </div>
    </AuthProvider>
  );
}
