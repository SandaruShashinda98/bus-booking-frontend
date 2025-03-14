import { createRoot } from "react-dom/client";
import "./index.css";
import { StrictMode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import SingleProfilePage from "./pages/SingleProfilePage";
// import Stats from "./pages/Stats";
// import BusSeatSelection from "./pages/Booking";
// import BookingCancellation from "./pages/Cancel";
import AvailableBusSchedules from "./pages/Available";
import LoginPage from "./pages/auth/Login";
import SeatBooking from "./pages/seat-booking/SeatBooking";

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
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/seat-booking",
    element: <SeatBooking />,
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
