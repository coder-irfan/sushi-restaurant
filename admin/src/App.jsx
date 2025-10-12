import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
import Loader from './pages/Loader';
import ProtectedRoutes from './components/ProtectedRoutes';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './components/Dashboard';
import NotFound from './components/NotFound';
import { useAdminAuth } from './context/AdminAuthContext';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Settings from './components/Settings';

function App() {
  const { loading } = useAdminAuth();

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="">
        <Routes>
          {/* Redirect root to login */}
          <Route
            path="/"
            element={<Navigate to="/admin/login" replace />}
          ></Route>
          <Route
            path="/admin/login"
            element={
              <Suspense fallback={<Loader />}>
                {' '}
                <AdminLogin />{' '}
              </Suspense>
            }
          ></Route>
          <Route
            path="/admin/forgotpassword"
            element={
              <Suspense fallback={<Loader />}>
                {' '}
                <ForgotPassword />{' '}
              </Suspense>
            }
          ></Route>
          <Route
            path="/admin/resetpassword/:token"
            element={
              <Suspense fallback={<Loader />}>
                {' '}
                <ResetPassword />{' '}
              </Suspense>
            }
          />

          <Route
            path="/admin/dashboard/settings"
            element={
              <Suspense fallback={<Loader />}>
                {' '}
                <Settings />{' '}
              </Suspense>
            }
          />

          <Route
            path="/admin/dashboard/*"
            element={
              <Suspense fallback={<Loader />}>
                <ProtectedRoutes>
                  {' '}
                  <Dashboard />{' '}
                </ProtectedRoutes>{' '}
              </Suspense>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          transition={Slide}
        />
      </div>
    </>
  );
}

export default App;
