import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Authenticated from './components/auth/AuthenticatedOnly';
import Guest from './components/auth/GuestOnly';
import Register from "./components/UserLoginRegistration/RegisterPage";
import Login from "./components/UserLoginRegistration/LoginPage";
import { CookiesProvider } from 'react-cookie';
import AuthProvider from './components/auth/AuthProvider'
import Profile from "./components/ProfilePage";
import Tool from "./components/Tool"
import HomePage from "./components/HomePage"



const router = createBrowserRouter([
  {
      path: "/register",
      element: <Guest component={Register} />,
  },
  {
      path: "/",
      element: <Authenticated component={HomePage}/>
  },
  {
      path: "/login",
      element: <Guest component={Login} />,
  },
  {
    path: "/profile",
    element: <Authenticated component={Profile} />,
  },
  {
    path: "/tool",
    element: <Authenticated component={Tool}/>
  }

]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<React.StrictMode>
<CookiesProvider>
      <AuthProvider>
          <RouterProvider router={router} />
      </AuthProvider>
  </CookiesProvider>  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
