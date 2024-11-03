import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/Home";
import Register from "../components/Register";
import PrivateRouter from "../PrivateRouter/PrivateRouter";
import Login from "../components/Login";
import ForgetPassword from "../components/ForgetPassword";
import Testing from "../components/Testing";
import DashboardLayout from "../layout/DashboardLayout";
import AddMenu from "../pages/dashboard/admin/AddMenu";
import Menu from "../pages/shop/Menu";
import ManageItems from "../pages/dashboard/admin/ManageItems";
import Users from "../pages/dashboard/Users";
import CartPage from "../pages/shop/CartPage";
import Order from "../pages/dashboard/Order";
import ManageBookings from "../pages/dashboard/admin/Manageorders";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/order",
        element: <Order />,
      },
      {
        path: "/menu",
        element: <Menu />,
      },
      {
        path: "/cart-page",
        element: (
          <PrivateRouter>
            <CartPage />
          </PrivateRouter>
        ),
      },
    ],
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forget-password",
    element: <ForgetPassword />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRouter>
        <DashboardLayout />
      </PrivateRouter>
    ),
    children: [
      {
        path: "add-menu",
        element: <AddMenu />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "manage-items",
        element: <ManageItems />,
      },
      {
        path: "manage-orders",
        element: <ManageBookings />,
      },
    ],
  },
]);

export default router;
