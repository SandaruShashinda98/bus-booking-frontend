import { createRoot } from "react-dom/client";
import "./index.css";
import { StrictMode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import SingleProfilePage from "./pages/SingleProfilePage";
import Stats from "./pages/Stats";
import BusSeatSelection from "./pages/Booking";
import BookingCancellation from "./pages/Cancel";
import AvailableBusSchedules from "./pages/Available";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/home",
    element: <AvailableBusSchedules />,
  },
  {
    path: "/stat",
    element: <Stats />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
    children: [
      {
        path: "/profile/:profileId",
        element: <SingleProfilePage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
