import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "../components/Layout";
import Dashboard from "../components/Screens/Dashboard";
import Home from "../components/Screens/Home";
import Login from "../components/Screens/Login";
import Operacoes from "../components/Screens/Operacoes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/main",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "operacoes",
        element: <Operacoes />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);

function Router() {
  return <RouterProvider router={router} />;
}

export default Router;
