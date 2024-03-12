/* eslint-disable jsx-a11y/anchor-is-valid */
import { observer } from "mobx-react-lite";
import useTitle from "../../shared/hooks/useTitle";
import IndividualDashboard from "./individual-dashboard/IndividualDashboard";
import { useEffect, useState } from "react";
import CompanyDashboard from "./company-dashboard/CompanyDashboard";
import useBackButton from "../../shared/hooks/useBack";
import DeparmentDashboard from "./departmental-dashboard/DeparmentDashboard";
import { useAppContext } from "../../shared/functions/Context";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import { USER_ROLES } from "../../shared/functions/CONSTANTS";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";

interface ITabsProps {
  tab: "Company" | "Department" | "Individual";
  setTab: React.Dispatch<
    React.SetStateAction<"Company" | "Department" | "Individual">
  >;
}
const Tabs = observer((props: ITabsProps) => {
  const { store } = useAppContext();
  const role = store.auth.role;

  const activeClass = (tab: "Company" | "Department" | "Individual") => {
    if (props.tab === tab) return "uk-active";
    return "";
  };

  return (
    <div className="dashboard--tabs">
      <ul className="kit-tabs" data-uk-tab>
        <li
          className={activeClass("Company")}
          onClick={() => props.setTab("Company")}
        >
          <a href="void(0)">Company Performance</a>
        </li>
        {role !== "Director" && (
          <li
            className={activeClass("Department")}
            onClick={() => props.setTab("Department")}
          >
            <a href="void(0)">Department Performance</a>
          </li>
        )}
        {!(
          role === USER_ROLES.EXECUTIVE_USER || role === USER_ROLES.MD_USER
        ) && (
          <>
            {role !== "Director" && (
              <li
                className={activeClass("Individual")}
                onClick={() => props.setTab("Individual")}
              >
                <a href="void(0)">Individual Performance</a>
              </li>
            )}
          </>
        )}
      </ul>
    </div>
  );
});

const Dashboard = observer(() => {
  const { api, store } = useAppContext();
  const scorecard = store.scorecard.active;
  const me = store.auth.meJson;

  useTitle("Dashboard");
  useBackButton();

  const [tab, setTab] = useState<"Company" | "Department" | "Individual">(
    "Company"
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      if (!scorecard) return;

      setLoading(true); // start loading
      try {
        await api.department.getAll();
        await api.departmentMeasure.getAll(scorecard.id);
        await api.departmentObjective.getAll(scorecard.id);

        await api.companyMeasure.getAll(scorecard.id);
        await api.companyObjective.getAll(scorecard.id);
      } catch (error) {
        console.log(error);
      }
      setLoading(false); // stop loading
    };

    loadAll();
  }, [
    api.companyMeasure,
    api.companyObjective,
    api.department,
    api.departmentMeasure,
    api.departmentObjective,
    scorecard,
  ]);
  

  console.log(me.role);

  return (
    <ErrorBoundary>
      <div className="dashboard uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          <ErrorBoundary>
            <Tabs tab={tab} setTab={setTab} />
          </ErrorBoundary>
          <ErrorBoundary>{loading && <LoadingEllipsis />}</ErrorBoundary>

          <ErrorBoundary>
            {tab === "Company" && !loading && <CompanyDashboard />}
            {tab === "Department" && !loading && <DeparmentDashboard />}
            {tab === "Individual" && !loading && <IndividualDashboard />}
          </ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  );
});

export default Dashboard;
