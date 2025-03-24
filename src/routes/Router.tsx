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
import SeatBookingPage from "@/pages/seat-booking/SeatBooking";
import TripListing from "@/pages/trip-listing/TripListing";
import Unauthorized from "@/pages/UnAuthorized";
import UserAccount from "@/pages/user/UserAccount";
import { Route, Routes } from "react-router-dom";
import RouteGuard from "./RouteGuard";
import { PERMISSIONS } from "@/config/permission";

export default function Router() {
  return (
    <Routes>
      <Route
        element={<RouteGuard allowedRoles={[PERMISSIONS.ADMIN]} />}
        errorElement={<NotFoundPage />}
      >
        <Route path="/user-account" element={<UserAccount />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trip-listing" element={<TripListing />} />
        <Route path="/fleet-management" element={<BusFleetManagement />} />
        <Route path="/restuarant-dashboard" element={<RestaurantDashBoard />} />
        <Route path="/menu-management" element={<MenuManagement />} />
        <Route path="/order-management" element={<OrderManagement />} />
      </Route>
      <Route
        element={<RouteGuard allowedRoles={[PERMISSIONS.USER]} />}
        errorElement={<NotFoundPage />}
      >
        <Route path="/bus-staff-management" element={<BusStaffManagement />} /> 
        <Route path="/home" element={<AvailableBusSchedules />} />
        <Route path="/seat-booking" element={<SeatBookingPage />} />
        <Route path="/cancel-booking" element={<BookingCancellation />} />
        <Route path="/meal-pre-order" element={<MealPreOrder />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}
    