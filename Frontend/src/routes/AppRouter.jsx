import { createBrowserRouter } from "react-router";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import { MainLayout } from "../layouts/MainLayout";
import { DashboardPage } from "../features/dashboard/pages/Dashboard";
import { HomePage } from "../pages/HomePage";

import { LoginPage } from "../features/auth/pages/Login";
import { RegisterPage } from "../features/auth/pages/Register";
import { ForgotPassword } from "../features/auth/pages/ForgotPassword";
import { FeedbacksPage } from "../features/feedbacks/pages/Feedbacks";
import { Analytics } from "../features/analytics/pages/Analytics";

import { AskLoop } from "../features/ask-loop/pages/AskLoop";
import { TeamSettings } from "../features/settings/pages/TeamSettings";
import { Integration } from "../features/settings/pages/Integration";
import { Reports } from "../features/reports/pages/Reports";

export const router = createBrowserRouter([
  // 1. PUBLIC LANDING PAGE
  {
    path: "/",
    element: <PublicRoute><HomePage /></PublicRoute>,
  },
  
  // 2. PUBLIC LOGIN ROUTE
  {
    path: "/login",
    element: <PublicRoute><LoginPage /></PublicRoute>,
  },
  
  // 3. PUBLIC FORGOT PASSWORD ROUTE
  {
    path: "/forgot-password",
    element: <PublicRoute><ForgotPassword /></PublicRoute>,
  },
  
  // 4. PUBLIC REGISTER ROUTE
  {
    path: "/register",
    element: <PublicRoute><RegisterPage /></PublicRoute>,
  },
  
  // 4. PROTECTED DASHBOARD ROUTES
  {
    path: "/dashboard",
    element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "feedbacks", element: <FeedbacksPage /> },
      { path: "analytics", element: <Analytics /> },
      { path: "reports", element: <Reports /> },
      { path: "integration", element: <Integration /> },
      { path: "team", element: <ProtectedRoute allowedRoles={['ADMIN']}><TeamSettings /></ProtectedRoute> },
    ]
  }
]);

