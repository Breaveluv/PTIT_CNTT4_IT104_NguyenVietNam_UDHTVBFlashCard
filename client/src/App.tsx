// Updated App.tsx
import React from "react";
import { createBrowserRouter, RouterProvider, Navigate, Outlet, useLocation } from "react-router-dom";
import Register from "./pages/Register";
// Import named exports thay vì default
import { Header, Footer, HomeContent } from "./pages/HomePage";
import Login from "./pages/Login";
import CategoriesPage from "./pages/CategoriesPage";
import FlashCard from "./pages/FlashCard";
import Quizz from "./pages/Quizz";
import WordPage from "./pages/WordPage";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const location = useLocation();

  const allowedPaths = ["/", "/login", "/register"];
  if (!currentUser && !allowedPaths.includes(location.pathname)) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser && ["/login", "/register"].includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Layout component with Header, Outlet, Footer
function AppLayout() {
  return (
    <>
      <Header /> 
      <Outlet />
      <Footer />  
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomeContent />, 
      },
      {
        path: "categories",
        element: <CategoriesPage />,
      },
      {
         path: "words",
        element: <WordPage></WordPage>
      },
      {
        path: "flashcards",
        element: <FlashCard />,
      },
      {
        path: "quizz",
        element: <Quizz />,
      },
      {
        path: "*",
        element: <Navigate to="." replace />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}