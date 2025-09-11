import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { WorkspaceProvider } from "./contexts/WorkspaceContext";
import { TodoProvider } from "./contexts/TodoContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Todo from "./components/Todo";

// Create router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: ":id",
        element: <Todo />,
      },
    ],
  },
  {
    path: "/workspace/:workspaceId",
    element: (
      <ProtectedRoute>
        <Layout>
          <Todo />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-gray-600 mb-4">Page not found</p>
          <a href="/" className="text-blue-500 hover:text-blue-600">
            Go back to home
          </a>
        </div>
      </div>
    ),
  },
]);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <TodoProvider>
          <RouterProvider router={router} />
        </TodoProvider>
      </WorkspaceProvider>
    </AuthProvider>
  );
};

export default App;
