import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/Layout";
import { AppProviders } from "./context/AppProvider";
import useAppInitializer from "./hooks/useAppInitializer";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const TransactionsPage = lazy(() => import("./pages/TransactionsPage"));
const AccountsPage = lazy(() => import("./pages/AccountsPage"));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"));

function AppRoutes() {
  useAppInitializer();
  const routes = [
    { path: "/", element: <DashboardPage /> },
    { path: "/transactions", element: <TransactionsPage /> },
    { path: "/accounts", element: <AccountsPage /> },
    { path: "/categories", element: <CategoriesPage /> },
  ];

  return (
    <Routes>
      {routes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={<MainLayout>{route.element}</MainLayout>}
        />
      ))}
    </Routes>
  );
}

function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}

export default App;
