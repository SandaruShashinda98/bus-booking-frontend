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
import DriverDashboard from "@/pages/DriverDashboard";
import TripPassengerView from "@/pages/AssignedTrips";
import PaymentInterface from "@/pages/seat-booking/Payment";
import UserManagement from "@/pages/user/UseManagement";
import RegisterPage from "@/pages/auth/Register";

export default function Router() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={<SearchTrips />}
        errorElement={<NotFoundPage />}
      />
      <Route path="/search" element={<SearchTrips />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/available" element={<AvailableBusSchedules />} />
      <Route path="/seat-booking/:tripID" element={<SeatBookingPage />} />
      <Route path="/cancel-booking" element={<BookingCancellation />} />
      <Route
        path="/meal-pre-order/:tripID/:nic/:bookingID"
        element={<MealPreOrder />}
      />
      <Route
        path="/payment/:tripID/:nic/:bookingId"
        element={<PaymentInterface />}
      />
      <Route path="/user-account" element={<UserAccount />} />

      {/*  admin */}
      <Route
        element={<RouteGuard allowedRoles={[PERMISSIONS.ADMIN]} />}
        errorElement={<NotFoundPage />}
      >
        <Route path="/user-management" element={<UserManagement />} />
      </Route>

      {/*  bus owner */}
      <Route
        element={<RouteGuard allowedRoles={[PERMISSIONS.BUS_OWNER]} />}
        errorElement={<NotFoundPage />}
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bus-staff-management" element={<BusStaffManagement />} />
        <Route path="/trip-listing" element={<TripListing />} />
        <Route path="/fleet-management" element={<BusFleetManagement />} />
        <Route
          path="/user-account"
          element={<UserAccount />}
          errorElement={<NotFoundPage />}
        />
      </Route>

      {/* restaurant */}
      <Route
        element={<RouteGuard allowedRoles={[PERMISSIONS.RESTAURANT]} />}
        errorElement={<NotFoundPage />}
      >
        <Route
          path="/user-account"
          element={<UserAccount />}
          errorElement={<NotFoundPage />}
        />
        <Route path="/restaurant-dashboard" element={<RestaurantDashBoard />} />
        <Route path="/menu-management" element={<MenuManagement />} />
        <Route path="/order-management" element={<OrderManagement />} />
      </Route>

      {/*  driver, conductor */}
      <Route
        element={
          <RouteGuard
            allowedRoles={[PERMISSIONS.DRIVER, PERMISSIONS.CONDUCTOR]}
          />
        }
        errorElement={<NotFoundPage />}
      >
        <Route
          path="/user-account"
          element={<UserAccount />}
          errorElement={<NotFoundPage />}
        />
        <Route path="/driver-dashboard" element={<DriverDashboard />} />
        <Route path="/assigned-trips" element={<TripPassengerView />} />
      </Route>

      {/* Error and Fallback Routes */}
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  );
}
