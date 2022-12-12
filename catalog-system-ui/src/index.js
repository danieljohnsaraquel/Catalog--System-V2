import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { UserProvider } from './UserContext';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import ErrorPage from './ErrorPage';
import LoginMain from './Login/Main';
import Admin from './Admin/Admin';
import User from './User/User';
import Products from './Admin/Products'
import Orders from './Admin/Orders'
import Employees from './Admin/Employees'
import Shop from './User/Shop';
import MyOrders from './User/MyOrders';
import Cart from './User/Cart';
import UserProfile from './User/UserProfile';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import 'react-datepicker/dist/react-datepicker.css'

const router = createBrowserRouter([
    {
      path: "/",
      element:<LoginMain />,
      errorElement: <ErrorPage />
    },
    {
      path: "/admin",
      element: <Admin />,
	    errorElement: <ErrorPage />,
      children: [
        {
          path: "",
          element: <Products />,
        },
        {
          path: "orders",
          element: <Orders />,
        },
        {
          path: "employees",
          element: <Employees />,
        },
      ],
    },
	{
		path: "/user",
		element: <User />,
		errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Shop />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "my-orders",
        element: <MyOrders />,
      },
      {
        path: "profile",
        element: <UserProfile />,
      },
    ],
	},
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
		<UserProvider>
			<ToastContainer position="top-right" autoClose={false} newestOnTop={false} closeOnClick rtl={false} pauseOnVisibilityChange pauseOnHover={false} pauseOnFocusLoss={false} />
    		<RouterProvider router={router} />
		</UserProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
