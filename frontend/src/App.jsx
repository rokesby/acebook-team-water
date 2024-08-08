import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import "./App.css";
import "./GlobalNavBar.css";
import { HomePage } from "./pages/Home/HomePage";
import { LoginPage } from "./pages/Login/LoginPage";
import { SignupPage } from "./pages/Signup/SignupPage";
import { FeedPage } from "./pages/Feed/FeedPage";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage";

import "bootstrap/dist/css/bootstrap.min.css";
import { CreatePostForm } from "./pages/CreatePost/CreatePostForm";
import { AddComment } from "./pages/AddComment/AddComment";
import { UpdatePostForm } from "./pages/UpdatePost/UpdatePost";
import { Error404Page } from "./pages/Error/Error404Page";

const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

export const ProtectedRoute = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}


// docs: https://reactrouter.com/en/main/start/overview
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/posts",
        element: <FeedPage />,
      },
      {
        path: "/createpost",
        element: <CreatePostForm />,
      },
      {
    
        path: "/addcomment",
        element: <AddComment />,
    
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/updatepost",
        element: <UpdatePostForm />
      }
    ],
  },
  {
    path: "*",
    element: <Error404Page />,
  }
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;


//give chatgpt all your files and ask it to create the files for showing comments
//you have been following chat gpt but maybe axios isnt right
//