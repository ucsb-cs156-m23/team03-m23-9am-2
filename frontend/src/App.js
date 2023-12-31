import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "main/pages/HomePage";
import ProfilePage from "main/pages/ProfilePage";
import AdminUsersPage from "main/pages/AdminUsersPage";

import UCSBDatesIndexPage from "main/pages/UCSBDates/UCSBDatesIndexPage";
import UCSBDatesCreatePage from "main/pages/UCSBDates/UCSBDatesCreatePage";
import UCSBDatesEditPage from "main/pages/UCSBDates/UCSBDatesEditPage";

import RestaurantIndexPage from "main/pages/Restaurants/RestaurantIndexPage";
import RestaurantCreatePage from "main/pages/Restaurants/RestaurantCreatePage";
import RestaurantEditPage from "main/pages/Restaurants/RestaurantEditPage";

import MenuItemReviewIndexPage from "main/pages/MenuItemReview/MenuItemReviewIndexPage";
import MenuItemReviewCreatePage from "main/pages/MenuItemReview/MenuItemReviewCreatePage";
import MenuItemReviewEditPage from "main/pages/MenuItemReview/MenuItemReviewEditPage";

import PlaceholderIndexPage from "main/pages/Placeholder/PlaceholderIndexPage";
import PlaceholderCreatePage from "main/pages/Placeholder/PlaceholderCreatePage";
import PlaceholderEditPage from "main/pages/Placeholder/PlaceholderEditPage";

import UCSBOrganizationIndexPage from "main/pages/UCSBOrganizations/UCSBOrganizationIndexPage";
import UCSBOrganizationCreatePage from "main/pages/UCSBOrganizations/UCSBOrganizationCreatePage";
import UCSBOrganizationEditPage from "main/pages/UCSBOrganizations/UCSBOrganizationEditPage";

import HelpRequestIndexPage from "main/pages/HelpRequests/HelpRequestIndexPage";
import HelpRequestCreatePage from "main/pages/HelpRequests/HelpRequestCreatePage";
import HelpRequestEditPage from "main/pages/HelpRequests/HelpRequestEditPage";

import UCSBDiningCommonsMenuItemIndexPage from "main/pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemIndexPage";
import UCSBDiningCommonsMenuItemCreatePage from "main/pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemCreatePage";
import UCSBDiningCommonsMenuItemEditPage from "main/pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemEditPage";

import RecommendationRequestIndexPage from "main/pages/RecommendationRequests/RecommendationRequestIndexPage";
import RecommendationRequestCreatePage from "main/pages/RecommendationRequests/RecommendationRequestCreatePage";
import RecommendationRequestEditPage from "main/pages/RecommendationRequests/RecommendationRequestEditPage";



import { hasRole, useCurrentUser } from "main/utils/currentUser";

import "bootstrap/dist/css/bootstrap.css";

function App() {
  const { data: currentUser } = useCurrentUser();

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/profile" element={<ProfilePage />} />
        {
          hasRole(currentUser, "ROLE_ADMIN") && <Route exact path="/admin/users" element={<AdminUsersPage />} />
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/ucsbdates" element={<UCSBDatesIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/ucsbdates/edit/:id" element={<UCSBDatesEditPage />} />
              <Route exact path="/ucsbdates/create" element={<UCSBDatesCreatePage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/restaurants" element={<RestaurantIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/restaurants/edit/:id" element={<RestaurantEditPage />} />
              <Route exact path="/restaurants/create" element={<RestaurantCreatePage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/menuItemReview" element={<MenuItemReviewIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/menuItemReview/edit/:id" element={<MenuItemReviewEditPage />} />
              <Route exact path="/menuItemReview/create" element={<MenuItemReviewCreatePage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>

              <Route exact path="/ucsborganization" element={<UCSBOrganizationIndexPage />} />

            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/ucsborganization/edit/:id" element={<UCSBOrganizationEditPage />} />
              <Route exact path="/ucsborganization/create" element={<UCSBOrganizationCreatePage />} />
            </>
          )
        }
         {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/placeholder" element={<PlaceholderIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/placeholder/edit/:id" element={<PlaceholderEditPage />} />
              <Route exact path="/placeholder/create" element={<PlaceholderCreatePage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/UCSBDiningCommonsMenuItem" element={<UCSBDiningCommonsMenuItemIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/UCSBDiningCommonsMenuItem/edit/:id" element={<UCSBDiningCommonsMenuItemEditPage />} />
              <Route exact path="/UCSBDiningCommonsMenuItem/create" element={<UCSBDiningCommonsMenuItemCreatePage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/helpRequest" element={<HelpRequestIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/helpRequest/edit/:id" element={<HelpRequestEditPage />} />
              <Route exact path="/helpRequest/create" element={<HelpRequestCreatePage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/RecommendationRequest" element={<RecommendationRequestIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/RecommendationRequest/edit/:id" element={<RecommendationRequestEditPage />} />
              <Route exact path="/RecommendationRequest/create" element={<RecommendationRequestCreatePage />} />
            </>
          )
        }
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
