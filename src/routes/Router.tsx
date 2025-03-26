import LoginPage from "@/pages/auth/Login";
import AvailableBusSchedules from "@/pages/Available";
import BusFleetManagement from "@/pages/bus-fleet/BusFleetManagement";
import BusStaffManagement from "@/pages/bus-staff/BusStaffManagement";
import Dashboard from "@/pages/Dashboard";
import NotFoundPage from "@/pages/NotFoundPage";
import MenuManagement from "@/pages/restaurant/MenuManagement";
import OrderManagement from "@/pages/restaurant/OrderManagement";
import RestaurantDashBoard from "@/pages/RestaurantDashBoard";
import BookingCancellation from "@/pages/seat-booking/CancelBooking";
import MealPreOrder from "@/pages/seat-booking/MealPreOrder";
import TripListing from "@/pages/trip-listing/TripListing";
import Unauthorized from "@/pages/UnAuthorized";
import UserAccount from "@/pages/user/UserAccount";
import { Route, Routes } from "react-router-dom";
import RouteGuard from "./RouteGuard";
import { PERMISSIONS } from "@/config/permission";
import SearchTrips from "@/pages/seat-booking/SearchTrips";
import SeatBookingPage from "@/pages/seat-booking/SeatBooking";

export default function Router() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<SearchTrips />} errorElement={<NotFoundPage />} />
      <Route path="/search" element={<SearchTrips />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/available" element={<AvailableBusSchedules />} />
      <Route path="/seat-booking/:tripID" element={<SeatBookingPage />} />
      <Route path="/cancel-booking" element={<BookingCancellation />} />
      <Route path="/meal-pre-order/:tripID/:nic" element={<MealPreOrder />} />
      <Route path="/user-account" element={<UserAccount />} errorElement={<NotFoundPage />} />

      {/* Admin Routes */}
      <Route
        element={<RouteGuard allowedRoles={[PERMISSIONS.ADMIN]} />}
        errorElement={<NotFoundPage />}
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bus-staff-management" element={<BusStaffManagement />} />
        <Route path="/trip-listing" element={<TripListing />} />
        <Route path="/fleet-management" element={<BusFleetManagement />} />
      </Route>

      {/* User Routes */}
      <Route
        element={<RouteGuard allowedRoles={[PERMISSIONS.USER]} />}
        errorElement={<NotFoundPage />}
      >
        <Route path="/restaurant-dashboard" element={<RestaurantDashBoard />} />
        <Route path="/menu-management" element={<MenuManagement />} />
        <Route path="/order-management" element={<OrderManagement />} />
      </Route>

      {/* Error and Fallback Routes */}
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  );
}

// const router = createBrowserRouter([
//public
//   {
//     path: "/",
//     element: <SearchTrips />,
//     errorElement: <NotFoundPage />,
//   },
//   {
//     path: "/user-account",
//     element: <UserAccount />,
//     errorElement: <NotFoundPage />,
//   },

//   // PERMISSIONS.ADMIN
//   {
//     path: "/dashboard",
//     element: <Dashboard />,
//     errorElement: <NotFoundPage />,
//   },
//   {
//     path: "/bus-staff-management",
//     element: <BusStaffManagement />,
//     errorElement: <NotFoundPage />,
//   },
//   {
//     path: "/trip-listing",
//     element: <TripListing />,
//   },
//   {
//     path: "/fleet-management",
//     element: <BusFleetManagement />,
//   },

//   // PERMISSIONS.USER
//   {
//     path: "/restaurant-dashboard",
//     element: <RestaurantDashBoard />,
//     errorElement: <NotFoundPage />,
//   },
//   {
//     path: "/menu-management",
//     element: <MenuManagement />,
//     errorElement: <NotFoundPage />,
//   },
//   {
//     path: "/order-management",
//     element: <OrderManagement />,
//     errorElement: <NotFoundPage />,
//   },

//   // public
//   {
//     path: "/search",
//     element: <SearchTrips />,
//   },
//   {
//     path: "/login",
//     element: <LoginPage />,
//   },
//   {
//     path: "/available",
//     element: <AvailableBusSchedules />,
//   },
//   {
//     path: "/seat-booking/:tripID",
//     element: <SeatBooking />,
//   },
//   {
//     path: "/cancel-booking",
//     element: <BookingCancellation />,
//   },
//   {
//     path: "/meal-pre-order/:tripID/:nic",
//     element: <MealPreOrder />,
//   },
//   // {
//   //   path: "/profile",
//   //   element: <ProfilePage />,
//   //   children: [
//   //     {
//   //       path: "/profile/:profileId",
//   //       element: <SingleProfilePage />,
//   //     },
//   //   ],
//   // },
// ]);
