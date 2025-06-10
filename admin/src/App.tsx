import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { verifyToken, setInitialized } from "./store/slices/authSlice";
import Layout from "./components/Layout";
import LoadingSpinner from "./components/LoadingSpinner";
import { Toaster } from "./components/ui/toaster";
import { Toaster as HotToaster } from "react-hot-toast";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import UserDetail from "./pages/UserDetail";
import Products from "./pages/Products";
import ProductForm from "./pages/ProductForm";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Analytics from "./pages/Analytics";
import Discounts from "./pages/Discounts";
import ContactMessages from "./pages/ContactMessages";
import Notifications from "./pages/Notifications";
import Currency from "./pages/Currency";
import Settings from "./pages/Settings"; // Assuming Settings page exists

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Auth Route Component (redirects to dashboard if already authenticated)
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
};

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { token, isInitialized } = useAppSelector((state) => state.auth);
  const { loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("adminToken");
      if (token && !isInitialized && !loading) {
        try {
          await dispatch(verifyToken());
        } catch (error) {
          console.error("Token verification failed:", error);
          dispatch(setInitialized());
        }
      } else if (!token) {
        dispatch(setInitialized());
      }
    };

    if (!isInitialized) {
      initializeAuth();
    }
  }, [dispatch, isInitialized, loading]);

  if (!isInitialized) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/users/:id" element={<UserDetail />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/new" element={<ProductForm />} />
                  <Route path="/products/:id/edit" element={<ProductForm />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/orders/:id" element={<OrderDetail />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/discounts" element={<Discounts />} />
                  <Route
                    path="/contact-messages"
                    element={<ContactMessages />}
                  />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/currency" element={<Currency />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
      <HotToaster position="top-right" />
      <Toaster />
    </Router>
  );
};

export default App;