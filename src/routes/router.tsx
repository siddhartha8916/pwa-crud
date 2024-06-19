import UserPage from "@/app/user";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Navigate, Route, Routes } from "react-router-dom";

// The main router component that defines the routes for the application.
const Router = () => {
  return (
    <Routes>
      {/* ====================== App Routes ====================== */}

      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<UserPage />} />
        <Route path="users" element={<>User</>} />
        <Route path="user-profile" element={<>User Profile</>} />
      </Route>

      {/* If no matching route is found, redirect to the dashboard */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default Router;
