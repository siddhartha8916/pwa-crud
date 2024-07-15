import AddSurvey from "@/app/add-survey";
import AddSurveyDynamic from "@/app/add-survey-dynamic";
import LanguageSelectionComponent from "@/app/language-selection";
import LoginUser from "@/app/login-user";
import RegisterUser from "@/app/register-user";
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
        <Route path="register" element={<RegisterUser/>} />
        <Route path="login" element={<LoginUser/>} />
        <Route path="users" element={<UserPage />} />
        <Route path="user-profile" element={<>User Profile</>} />
        <Route path="survey" element={<AddSurvey />} />
        <Route path="dynamic-survey" element={<AddSurveyDynamic />} />
      </Route>

      {/* If no matching route is found, redirect to the dashboard */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default Router;
