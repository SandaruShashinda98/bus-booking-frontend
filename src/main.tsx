import { createRoot } from "react-dom/client";
import "./index.css";
import { StrictMode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
// import Stats from "./pages/Stats";
// import BusSeatSelection from "./pages/Booking";
// import BookingCancellation from "./pages/Cancel";
import AvailableBusSchedules from "./pages/Available";
import LoginPage from "./pages/auth/Login";
import SeatBooking from "./pages/seat-booking/SeatBooking";
import TripListing from "./pages/trip-listing/TripListing";
import BookingCancellation from "./pages/Cancel";
import MealPreOrder from "./pages/seat-booking/MealPreOrder";
import Dashboard from "./pages/Dashboard";
import UserAccount from "./pages/user/UserAccount";
import BusStaffManagement from "./pages/bus-staff/BusStaffManagement";
import BusFleetManagement from "./pages/bus-fleet/BusFleetManagement";
import RestaurantDashBoard from "./pages/RestaurantDashBoard";
import MenuManagement from "./pages/restaurant/MenuManagement";
import OrderManagement from "./pages/restaurant/OrderManagement";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/user-account",
    element: <UserAccount />,
    errorElement: <NotFoundPage />,
  },

  // bus owner
  {
    path: "/dashboard",
    element: <Dashboard />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/bus-staff-management",
    element: <BusStaffManagement />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/trip-listing",
    element: <TripListing />,
  },
  {
    path: "/fleet-management",
    element: <BusFleetManagement />,
  },

  // restaurant
  {
    path: "/restaurant-dashboard",
    element: <RestaurantDashBoard />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/menu-management",
    element: <MenuManagement />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/order-management",
    element: <OrderManagement />,
    errorElement: <NotFoundPage />,
  },

  // public
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/home",
    element: <AvailableBusSchedules />,
  },
  {
    path: "/seat-booking",
    element: <SeatBooking />,
  },
  {
    path: "/cancel-booking",
    element: <BookingCancellation />,
  },
  {
    path: "/meal-pre-order",
    element: <MealPreOrder />,
  },
  // {
  //   path: "/profile",
  //   element: <ProfilePage />,
  //   children: [
  //     {
  //       path: "/profile/:profileId",
  //       element: <SingleProfilePage />,
  //     },
  //   ],
  // },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
