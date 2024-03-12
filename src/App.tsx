import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AppApi from "./shared/apis/AppApi";
import Loading from "./shared/components/loading/Loading";
import SnackbarManager from "./shared/components/snackbar/SnackbarManager";
import { AppContext, useAppContext } from "./shared/functions/Context";
import AppStore from "./shared/stores/AppStore";
import UiStore from "./shared/stores/UiStore";

import Dashboard from "./logged-in/dashboard/Dashboard";
import IndividualScorecard from "./logged-in/execution-scorecard/IndividualScorecard";
import People from "./logged-in/execution-team/People";

import AdminSettings from "./logged-in/admin-settings/AdminSettings";
import Reports from "./logged-in/reports/Reports";
import EmployeeScorecard from "./logged-in/execution-supervision/EmployeeScorecard";
import PeopleView from "./logged-in/execution-team-view/PeopleView";

import EmployeeScorecardView from "./logged-in/execution-supervision-view/EmployeeScorecardView";
import PrivateRoute from "./shared/functions/PrivateRoute";
import LoggedOut from "./logged-out/LoggedOut";

import CompanyScorecards from "./logged-in/company-scorecards/CompanyScorecards";
import CompanyScorecard from "./logged-in/company-scorecard/CompanyScorecard";
import DepartmentScorecards from "./logged-in/department-scorecards/DepartmentScorecards";
import DepartmentScorecard from "./logged-in/department-scorecard/DepartmentScorecard";
import CompanyScorecardObjective from "./logged-in/company-scorecard-objective/CompanyScorecardObjective";
import DepartmentScorecardObjective from "./logged-in/department-scorecard-objective/DepartmentScorecardObjective";
import { observer } from "mobx-react-lite";
import { USER_ROLES } from "./shared/functions/CONSTANTS";
import PerformanceReviews from "./logged-in/performance-reviews/PerformanceReviews";
import Drive from "./logged-in/drive/Drive";
import IndividualScorecardDraftObjective from "./logged-in/execution-scorecard-objective-draft/IndividualScorecardDraftObjective";
import StrategyThemes from "./logged-in/strategy-themes/StrategyThemes";
import useNetwork from "./shared/hooks/useNetwork";
import DepartmentScorecardReviews from "./logged-in/strategy-department-scorecard-reviews/DepartmentScorecardReviews";
import DepartmentScorecardReviewView from "./logged-in/strategy-department-scorecard-reviews-view/DepartmentScorecardReviewView";
import CompanyScorecardReviews from "./logged-in/company-scorecard-reviews/CompanyScorecardReviews";
import CompanyScorecardReviewView from "./logged-in/company-scorecard-reviews-view/CompanyScorecardReviewView";
import StrategyMapPage from "./logged-in/overview-strategy-map/StrategyMapPage";
import UserProjects from "./logged-in/project-management/UsersProjects";
import PortfolioProjects from "./logged-in/project-management/PortfolioProjects";
import ProjectView from "./logged-in/project-management/ProjectView";
import PortfolioPage from "./logged-in/project-management/PortfolioPage";
import Tasks from "./logged-in/project-management/Tasks";
import CheckIn from "./logged-in/check-in-year/CheckIn";
import CheckInYearView from "./logged-in/check-in-year-view/CheckInYearView";
import CheckInMonthView from "./logged-in/check-in-month-view/CheckInMonthView";
import CheckInMonthUserView from "./logged-in/check-in-month-user-view/CheckInMonthUserView";
import Statistics from "./logged-in/project-management/Statistics";
import { SubordinateScorecard } from "./logged-in/execution-scorecard/subordinate-scorecards/SubordinateScorecaard";
// import CompanyJobCard from "./logged-in/company-job-card/CompanyJobCard";
// import JobCardOverview from "./logged-in/company-job-card/JobCardOverview";

import JobDashboard from "./logged-in/job-cards/dashboard/JobDashboard";
import JobCardOverview from "./logged-in/job-cards/JobCardOverview";


// Lazy load components
const LoggedIn = lazy(() => import("./logged-in/LoggedIn"));

const PrivateLoggedIn = () => (
  <PrivateRoute>
    <Suspense fallback={<Loading fullHeight={true} />}>
      <LoggedIn />
    </Suspense>
  </PrivateRoute>
);

const DEV_MODE_ROUTES = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="c" element={<PrivateLoggedIn />}>
          {/* OVERVIEW */}
          <Route path="home/dashboard" element={<Dashboard />} />
          <Route path="home/strategy-map" element={<StrategyMapPage />} />

          {/* STRATEGY */}
          <Route path="strategy/themes" element={<StrategyThemes />} />
          <Route path="strategy/company" element={<CompanyScorecards />} />
          <Route path="strategy/company/:fyid" element={<CompanyScorecard />} />
          <Route
            path="strategy/company/:fyid/:objectiveId"
            element={<CompanyScorecardObjective />}
          />
          <Route
            path="strategy/company-review"
            element={<CompanyScorecardReviews />}
          />
          <Route
            path="strategy/company-review/:fyid"
            element={<CompanyScorecardReviewView />}
          />
          {/*JOBCARD*/}
          <Route path="job-cards/dashboard" element={<JobDashboard />} />
          <Route path="job-cards/create" element={<JobCardOverview />} />

          <Route
            path="strategy/department"
            element={<DepartmentScorecards />}
          />
          <Route
            path="strategy/department/:fyid/:departmentId"
            element={<DepartmentScorecard />}
          />
          <Route
            path="strategy/department/:fyid/:departmentId/:objectiveId"
            element={<DepartmentScorecardObjective />}
          />

          <Route
            path="strategy/department-review"
            element={<DepartmentScorecardReviews />}
          />
          <Route
            path="strategy/department-review/:fyid/:departmentId"
            element={<DepartmentScorecardReviewView />}
          />

          {/* SCORECARDS */}
          {/* Executive & MD don't have personal/individual scorecard */}
          <Route path="scorecards/my" element={<IndividualScorecard />} />
          <Route
            path="scorecards/my/:id"
            element={<IndividualScorecardDraftObjective />}
          />
          <Route
            path="scorecards/supervision"
            element={<EmployeeScorecard />}
          />
          <Route
            path="scorecards/supervision/:uid"
            element={<EmployeeScorecardView />}
          />

          <Route
            path="scorecards/subordinate"
            element={<SubordinateScorecard />}
          />

          <Route path="scorecards/people" element={<People />} />
          <Route path="scorecards/people/:uid" element={<PeopleView />} />
          <Route path="scorecards/reviews" element={<PerformanceReviews />} />

          {/* Projects */}
          <Route path="projects" element={<UserProjects />} />
          <Route path="projects/:id" element={<PortfolioProjects />} />
          <Route path="project/:projectId" element={<ProjectView />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="checkin" element={<CheckIn />} />
          <Route path="checkin/:yearId" element={<CheckInYearView />} />
          <Route
            path="checkin/:yearId/:monthId"
            element={<CheckInMonthView />}
          />
          <Route
            path="checkin/:yearId/:monthId/:uid"
            element={<CheckInMonthUserView />}
          />

          <Route path="statistics" element={<Statistics />} />

          {/* PORTFOLIO OF EVIDENCE */}
          <Route path="drive" element={<Drive />} />
          <Route path="drive/:id" element={<Drive />} />

          {/* REPORTS */}
          <Route path="reports/kpis" element={<Reports />} />

          {/* ADMIN */}
          <Route path="admin/settings" element={<AdminSettings />} />
          <Route path="*" element={<Navigate to="home/dashboard" />} />
        </Route>

        <Route path="/" element={<LoggedOut />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};
const DIRECTOR_USER_ROUTES = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="c" element={<PrivateLoggedIn />}>
          {/* OVERVIEW */}
          <Route path="home/dashboard" element={<Dashboard />} />
          <Route path="home/strategy-map" element={<StrategyMapPage />} />

          {/* STRATEGY */}
          <Route path="strategy/company" element={<CompanyScorecards />} />
          <Route path="strategy/company/:fyid" element={<CompanyScorecard />} />
          <Route
            path="strategy/company/:fyid/:objectiveId"
            element={<CompanyScorecardObjective />}
          />
          <Route
            path="strategy/company-review"
            element={<CompanyScorecardReviews />}
          />
          <Route
            path="strategy/company-review/:fyid"
            element={<CompanyScorecardReviewView />}
          />

          <Route path="*" element={<Navigate to="home/dashboard" />} />
        </Route>

        <Route path="/" element={<LoggedOut />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};
const MD_USER_ROUTES = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="c" element={<PrivateLoggedIn />}>
          {/* OVERVIEW */}
          <Route path="home/dashboard" element={<Dashboard />} />
          <Route path="home/strategy-map" element={<StrategyMapPage />} />

          {/* STRATEGY */}
          <Route path="strategy/company" element={<CompanyScorecards />} />
          <Route path="strategy/company/:fyid" element={<CompanyScorecard />} />
          <Route
            path="strategy/company/:fyid/:objectiveId"
            element={<CompanyScorecardObjective />}
          />
          <Route
            path="strategy/department"
            element={<DepartmentScorecards />}
          />
          <Route
            path="strategy/department/:fyid/:departmentId"
            element={<DepartmentScorecard />}
          />
          <Route
            path="strategy/department/:fyid/:departmentId/:objectiveId"
            element={<DepartmentScorecardObjective />}
          />

          <Route
            path="strategy/department-review"
            element={<DepartmentScorecardReviews />}
          />
          <Route
            path="strategy/department-review/:fyid/:departmentId"
            element={<DepartmentScorecardReviewView />}
          />

          {/* SCORECARDS */}
          {/* Executive & MD don't have personal/individual scorecard */}
          <Route path="scorecards/my" element={<IndividualScorecard />} />
          <Route
            path="scorecards/my/:id"
            element={<IndividualScorecardDraftObjective />}
          />
          <Route
            path="scorecards/supervision"
            element={<EmployeeScorecard />}
          />
          <Route
            path="scorecards/supervision/:uid"
            element={<EmployeeScorecardView />}
          />
          <Route path="scorecards/people" element={<People />} />
          <Route path="scorecards/people/:uid" element={<PeopleView />} />
          <Route path="scorecards/reviews" element={<PerformanceReviews />} />

          {/* PORTFOLIO OF EVIDENCE */}
          <Route path="drive" element={<Drive />} />
          <Route path="drive/:id" element={<Drive />} />

          {/* REPORTS */}
          <Route path="reports/kpis" element={<Reports />} />

          <Route path="*" element={<Navigate to="home/dashboard" />} />
        </Route>

        <Route path="/" element={<LoggedOut />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};
const SUPER_USER_ROUTES = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="c" element={<PrivateLoggedIn />}>
          {/* OVERVIEW */}
          <Route path="home/dashboard" element={<Dashboard />} />
          <Route path="home/strategy-map" element={<StrategyMapPage />} />

          {/* STRATEGY */}
          <Route path="strategy/themes" element={<StrategyThemes />} />
          <Route path="strategy/company" element={<CompanyScorecards />} />
          <Route path="strategy/company/:fyid" element={<CompanyScorecard />} />
          <Route
            path="strategy/company/:fyid/:objectiveId"
            element={<CompanyScorecardObjective />}
          />
          <Route
            path="strategy/company-review"
            element={<CompanyScorecardReviews />}
          />
          <Route
            path="strategy/company-review/:fyid"
            element={<CompanyScorecardReviewView />}
          />

          <Route
            path="strategy/department"
            element={<DepartmentScorecards />}
          />
          <Route
            path="strategy/department/:fyid/:departmentId"
            element={<DepartmentScorecard />}
          />
          <Route
            path="strategy/department/:fyid/:departmentId/:objectiveId"
            element={<DepartmentScorecardObjective />}
          />

          <Route
            path="strategy/department-review"
            element={<DepartmentScorecardReviews />}
          />
          <Route
            path="strategy/department-review/:fyid/:departmentId"
            element={<DepartmentScorecardReviewView />}
          />

          {/* SCORECARDS */}
          {/* Executive & MD don't have personal/individual scorecard */}
          <Route path="scorecards/my" element={<IndividualScorecard />} />
          <Route
            path="scorecards/my/:id"
            element={<IndividualScorecardDraftObjective />}
          />
          <Route
            path="scorecards/supervision"
            element={<EmployeeScorecard />}
          />
          <Route
            path="scorecards/supervision/:uid"
            element={<EmployeeScorecardView />}
          />
          <Route path="scorecards/people" element={<People />} />
          <Route path="scorecards/people/:uid" element={<PeopleView />} />
          <Route path="scorecards/reviews" element={<PerformanceReviews />} />

          {/* PORTFOLIO OF EVIDENCE */}
          <Route path="drive" element={<Drive />} />
          <Route path="drive/:id" element={<Drive />} />

          {/* REPORTS */}
          <Route path="reports/kpis" element={<Reports />} />

          {/* ADMIN */}
          <Route path="admin/settings" element={<AdminSettings />} />
          <Route path="*" element={<Navigate to="home/dashboard" />} />
        </Route>

        <Route path="/" element={<LoggedOut />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};
const EXECUTIVE_USER_ROUTES = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="c" element={<PrivateLoggedIn />}>
          {/* OVERVIEW */}
          <Route path="home/dashboard" element={<Dashboard />} />
          <Route path="home/strategy-map" element={<StrategyMapPage />} />

          {/* STRATEGY */}
          <Route path="strategy/company" element={<CompanyScorecards />} />
          <Route path="strategy/company/:fyid" element={<CompanyScorecard />} />
          <Route
            path="strategy/company/:fyid/:objectiveId"
            element={<CompanyScorecardObjective />}
          />
          <Route
            path="strategy/department"
            element={<DepartmentScorecards />}
          />
          <Route
            path="strategy/department/:fyid/:departmentId"
            element={<DepartmentScorecard />}
          />
          <Route
            path="strategy/department/:fyid/:departmentId/:objectiveId"
            element={<DepartmentScorecardObjective />}
          />

          {/* SCORECARDS */}
          <Route
            path="scorecards/supervision"
            element={<EmployeeScorecard />}
          />
          <Route
            path="scorecards/supervision/:uid"
            element={<EmployeeScorecardView />}
          />
          <Route path="scorecards/people" element={<People />} />
          <Route path="scorecards/people/:uid" element={<PeopleView />} />
          <Route path="scorecards/reviews" element={<PerformanceReviews />} />

          {/* PORTFOLIO OF EVIDENCE */}
          <Route path="drive" element={<Drive />} />
          <Route path="drive/:id" element={<Drive />} />

          {/* REPORTS */}
          <Route path="reports/kpis" element={<Reports />} />

          <Route path="*" element={<Navigate to="home/dashboard" />} />
        </Route>

        <Route path="/" element={<LoggedOut />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};
const ADMIN_USER_ROUTES = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="c" element={<PrivateLoggedIn />}>
          {/* OVERVIEW */}
          <Route path="home/dashboard" element={<Dashboard />} />
          <Route path="home/strategy-map" element={<StrategyMapPage />} />

          {/* STRATEGY */}
          <Route path="strategy/company" element={<CompanyScorecards />} />
          <Route path="strategy/company/:fyid" element={<CompanyScorecard />} />
          <Route
            path="strategy/company/:fyid/:objectiveId"
            element={<CompanyScorecardObjective />}
          />
          <Route
            path="strategy/department"
            element={<DepartmentScorecards />}
          />
          <Route
            path="strategy/department/:fyid/:departmentId"
            element={<DepartmentScorecard />}
          />
          <Route
            path="strategy/department/:fyid/:departmentId/:objectiveId"
            element={<DepartmentScorecardObjective />}
          />

          {/* SCORECARDS */}
          <Route path="scorecards/my" element={<IndividualScorecard />} />
          <Route
            path="scorecards/my/:id"
            element={<IndividualScorecardDraftObjective />}
          />
          <Route
            path="scorecards/supervision"
            element={<EmployeeScorecard />}
          />
          <Route
            path="scorecards/supervision/:uid"
            element={<EmployeeScorecardView />}
          />
          <Route path="scorecards/people" element={<People />} />
          <Route path="scorecards/people/:uid" element={<PeopleView />} />

          {/* PORTFOLIO OF EVIDENCE */}
          <Route path="drive" element={<Drive />} />
          <Route path="drive/:id" element={<Drive />} />

          {/* ADMIN */}
          <Route path="admin/settings" element={<AdminSettings />} />
          <Route path="*" element={<Navigate to="home/dashboard" />} />
        </Route>

        <Route path="/" element={<LoggedOut />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};
const MANAGER_USER_ROUTES = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="c" element={<PrivateLoggedIn />}>
          {/* OVERVIEW */}
          <Route path="home/dashboard" element={<Dashboard />} />
          <Route path="home/strategy-map" element={<StrategyMapPage />} />

          {/* STRATEGY */}
          <Route path="strategy/company" element={<CompanyScorecards />} />
          <Route path="strategy/company/:fyid" element={<CompanyScorecard />} />
          <Route
            path="strategy/company/:fyid/:objectiveId"
            element={<CompanyScorecardObjective />}
          />

          <Route
            path="strategy/department"
            element={<DepartmentScorecards />}
          />
          <Route
            path="strategy/department/:fyid/:departmentId"
            element={<DepartmentScorecard />}
          />

          {/* SCORECARDS */}
          {/* Executive & MD don't have personal/individual scorecard */}
          <Route path="scorecards/my" element={<IndividualScorecard />} />
          <Route
            path="scorecards/my/:id"
            element={<IndividualScorecardDraftObjective />}
          />
          <Route
            path="scorecards/supervision"
            element={<EmployeeScorecard />}
          />
          <Route
            path="scorecards/supervision/:uid"
            element={<EmployeeScorecardView />}
          />
          <Route path="scorecards/people" element={<People />} />
          <Route path="scorecards/people/:uid" element={<PeopleView />} />
          <Route path="scorecards/reviews" element={<PerformanceReviews />} />

          {/* PORTFOLIO OF EVIDENCE */}
          <Route path="drive" element={<Drive />} />
          <Route path="drive/:id" element={<Drive />} />

          <Route path="*" element={<Navigate to="home/dashboard" />} />
        </Route>

        <Route path="/" element={<LoggedOut />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};
const SUPERVISOR_USER_ROUTES = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="c" element={<PrivateLoggedIn />}>
          {/* OVERVIEW */}
          <Route path="home/dashboard" element={<Dashboard />} />
          <Route path="home/strategy-map" element={<StrategyMapPage />} />

          {/* STRATEGY */}
          <Route path="strategy/company" element={<CompanyScorecards />} />
          <Route path="strategy/company/:fyid" element={<CompanyScorecard />} />
          <Route
            path="strategy/company/:fyid/:objectiveId"
            element={<CompanyScorecardObjective />}
          />

          <Route
            path="strategy/department"
            element={<DepartmentScorecards />}
          />
          <Route
            path="strategy/department/:fyid/:departmentId"
            element={<DepartmentScorecard />}
          />

          {/* SCORECARDS */}
          {/* Executive & MD don't have personal/individual scorecard */}
          <Route path="scorecards/my" element={<IndividualScorecard />} />
          <Route
            path="scorecards/my/:id"
            element={<IndividualScorecardDraftObjective />}
          />
          <Route
            path="scorecards/supervision"
            element={<EmployeeScorecard />}
          />
          <Route
            path="scorecards/supervision/:uid"
            element={<EmployeeScorecardView />}
          />
          <Route path="scorecards/people" element={<People />} />
          <Route path="scorecards/people/:uid" element={<PeopleView />} />
          <Route path="scorecards/reviews" element={<PerformanceReviews />} />

          {/* PORTFOLIO OF EVIDENCE */}
          <Route path="drive" element={<Drive />} />
          <Route path="drive/:id" element={<Drive />} />

          <Route path="*" element={<Navigate to="home/dashboard" />} />
        </Route>

        <Route path="/" element={<LoggedOut />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};
const EMPLOYEE_USER_ROUTES = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="c" element={<PrivateLoggedIn />}>
          {/* OVERVIEW */}
          <Route path="home/dashboard" element={<Dashboard />} />
          <Route path="home/strategy-map" element={<StrategyMapPage />} />

          {/* STRATEGY */}
          <Route path="strategy/company" element={<CompanyScorecards />} />
          <Route path="strategy/company/:fyid" element={<CompanyScorecard />} />
          <Route
            path="strategy/company/:fyid/:objectiveId"
            element={<CompanyScorecardObjective />}
          />
          <Route
            path="strategy/department"
            element={<DepartmentScorecards />}
          />
          <Route
            path="strategy/department/:fyid/:departmentId"
            element={<DepartmentScorecard />}
          />
          <Route
            path="strategy/department/:fyid/:departmentId/:objectiveId"
            element={<DepartmentScorecardObjective />}
          />
            <Route
            path="strategy/company-review"
            element={<CompanyScorecardReviews />}
          />
          <Route
            path="strategy/company-review/:fyid"
            element={<CompanyScorecardReviewView />}
          />

          <Route
            path="strategy/department"
            element={<DepartmentScorecards />}
          />
          <Route
            path="strategy/department/:fyid/:departmentId"
            element={<DepartmentScorecard />}
          />
          <Route
            path="strategy/department/:fyid/:departmentId/:objectiveId"
            element={<DepartmentScorecardObjective />}
          />

          <Route
            path="strategy/department-review"
            element={<DepartmentScorecardReviews />}
          />
          <Route
            path="strategy/department-review/:fyid/:departmentId"
            element={<DepartmentScorecardReviewView />}
          />

          {/* SCORECARDS */}
          {/* Executive & MD don't have personal/individual scorecard */}
          <Route path="scorecards/my" element={<IndividualScorecard />} />
          <Route
            path="scorecards/my/:id"
            element={<IndividualScorecardDraftObjective />}
          />
          <Route
            path="scorecards/supervision"
            element={<EmployeeScorecard />}
          />
          <Route
            path="scorecards/supervision/:uid"
            element={<EmployeeScorecardView />}
          />

          <Route
            path="scorecards/subordinate"
            element={<SubordinateScorecard />}
          />

          <Route path="scorecards/people" element={<People />} />
          <Route path="scorecards/people/:uid" element={<PeopleView />} />
          <Route path="scorecards/reviews" element={<PerformanceReviews />} />

          {/* Projects */}
          <Route path="projects" element={<UserProjects />} />
          <Route path="projects/:id" element={<PortfolioProjects />} />
          <Route path="project/:projectId" element={<ProjectView />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="checkin" element={<CheckIn />} />
          <Route path="checkin/:yearId" element={<CheckInYearView />} />
          <Route
            path="checkin/:yearId/:monthId"
            element={<CheckInMonthView />}
          />
          <Route
            path="checkin/:yearId/:monthId/:uid"
            element={<CheckInMonthUserView />}
          />

          <Route path="statistics" element={<Statistics />} />

          {/* PORTFOLIO OF EVIDENCE */}
          <Route path="drive" element={<Drive />} />
          <Route path="drive/:id" element={<Drive />} />

          {/*JOBCARD*/}
          <Route path="job-cards/dashboard" element={<JobDashboard />} />
          <Route path="job-cards/create" element={<JobCardOverview/>} />
      

          {/* SCORECARDS */}
          {/* Executive & MD don't have personal/individual scorecard */}
          <Route path="scorecards/my" element={<IndividualScorecard />} />
          <Route
            path="scorecards/my/:id"
            element={<IndividualScorecardDraftObjective />}
          />
      
          {/* PORTFOLIO OF EVIDENCE */}
          <Route path="drive" element={<Drive />} />
          <Route path="drive" element={<Drive />} />
          <Route path="drive/:id" element={<Drive />} />

          <Route path="*" element={<Navigate to="home/dashboard" />} />
        </Route>

        <Route path="/" element={<LoggedOut />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};
const GUEST_USER_ROUTES = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="c" element={<PrivateLoggedIn />}>
          {/* OVERVIEW */}
          <Route path="home/dashboard" element={<Dashboard />} />
          <Route path="home/strategy-map" element={<StrategyMapPage />} />

          <Route path="*" element={<Navigate to="home/dashboard" />} />
        </Route>

        <Route path="/" element={<LoggedOut />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

const MainRoutes = observer(() => {
  const { store } = useAppContext();
  const role = store.auth.role;

  useNetwork();

  const DEV_MODE =
    !process.env.NODE_ENV || process.env.NODE_ENV === "development";

  if (DEV_MODE) return <DEV_MODE_ROUTES />;

  switch (role) {
    case USER_ROLES.DIRECTOR_USER:
      return <DIRECTOR_USER_ROUTES />;

    case USER_ROLES.MD_USER:
      return <MD_USER_ROUTES />;

    case USER_ROLES.SUPER_USER:
      return <SUPER_USER_ROUTES />;

    case USER_ROLES.EXECUTIVE_USER:
      return <EXECUTIVE_USER_ROUTES />;

    case USER_ROLES.ADMIN_USER:
      return <ADMIN_USER_ROUTES />;

    case USER_ROLES.MANAGER_USER:
      return <MANAGER_USER_ROUTES />;

    case USER_ROLES.SUPERVISOR_USER:
      return <SUPERVISOR_USER_ROUTES />;

    case USER_ROLES.EMPLOYEE_USER:
      return <EMPLOYEE_USER_ROUTES />;

    default:
      return <GUEST_USER_ROUTES />;
  }
});

const App = () => {
  const store = new AppStore();
  const api = new AppApi(store);
  const ui = new UiStore();

  return (
    <div className="app">
      <AppContext.Provider value={{ store, api, ui }}>
        <MainRoutes />
        <SnackbarManager />
      </AppContext.Provider>
    </div>
  );
};

export default App;

// HgJEiB0Q6NXtoKpiW6WwRJxAkFO2
