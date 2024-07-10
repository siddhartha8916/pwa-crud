import AddSurvey from "@/app/add-survey";
import LanguageSelectionComponent from "@/app/language-selection";
import UserPage from "@/app/user";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Navigate, Route, Routes } from "react-router-dom";

// The main router component that defines the routes for the application.
const Router = () => {
  return (
    <Routes>
      {/* ====================== App Routes ====================== */}

      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<LanguageSelectionComponent />} />
        <Route path="users" element={<UserPage />} />
        <Route path="user-profile" element={<>User Profile</>} />
        <Route path="survey" element={<AddSurvey />} />
      </Route>

      {/* If no matching route is found, redirect to the dashboard */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default Router;
