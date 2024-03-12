import { useCallback, useEffect, useState } from "react";
import useTitle from "../../shared/hooks/useTitle";
import DepartmentTabContent from "./department-tab-content/DepartmentTabContent";
import PeopleTabContent from "./people-tab-content/PeopleTabContent";
import ReportTabs from "./ReportTabs";
import StrategyTabContent from "./strategy-tab-content/StrategyTabContent";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../shared/functions/Context";
import { IMeasure } from "../../shared/models/Measure";
import { IUserPerformanceData } from "../../shared/models/Report";
import { IUser } from "../../shared/models/User";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import useBackButton from "../../shared/hooks/useBack";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import ExecutionTabContent from "./execution-rate-tab-content/ExecutionTabContent";

const Reports = observer(() => {
  const { api, store } = useAppContext();
  const [selectedTab, setselectedTab] = useState("strategy-tab");
  const [loading, setLoading] = useState(false);

  const fyid = store.scorecard.activeId;

  useTitle("KPI Reports");
  useBackButton();

  // get all measures and group by department
  const measures = store.measure.all.map((measure) => measure.asJson);
  // get all departments
  const departments = store.department.all.map((dep) => dep.asJson);
  // get all users
  const users = store.user.all.map((user) => user.asJson);

  // calculate the rating for each user
  const totalRating = (measures: IMeasure[]) => {
    const rating =
      measures.reduce((acc, measure) => {
        return acc + (measure.autoRating || 1);
      }, 0) / measures.length;
    return Math.round((rating || 1) * 10) / 10;
  };

  // verify the measures weight per user add up to 100
  // const verifyTotalWeight = (measures: IMeasure[]) => {
  //   const weight = totalWeight(measures);
  //   if (weight !== 100) return false;
  //   return true;
  // };

  const verifyTotalWeight = useCallback((measures: IMeasure[]) => {
    const weight = totalWeight(measures);
    if (weight !== 100) return false;
    return true;
  }, []);

  // total weight per user add up to 100
  const totalWeight = (measures: IMeasure[]) => {
    const totalWeight = measures.reduce((acc, measure) => {
      return acc + measure.weight;
    }, 0);

    return totalWeight;
  };

  const userMeasures = (measures: IMeasure[], user: IUser) => {
    // console.log("User: ", user.displayName);
    // if (!user.devUser)
    return measures.filter((measure) => measure.uid === user.uid);

    // return [];
  };

  // resolve the department name from the department id
  // const getDepartmentNameFromId = (departmentId: string) => {
  //   const department = departments.find(
  //     (department) => department.id === departmentId
  //   );
  //   return department ? department.name : "";
  // };

  const getDepartmentNameFromId = useCallback((departmentId: string) => {
    const department = departments.find((department) => department.id === departmentId);
    return department ? department.name : "";
  }, [departments]);

  const userPerformanceData = useCallback(() => {
    const data: IUserPerformanceData[] = [];
    for (const user of users) {
      if (user.devUser) continue;
      // get user measures
      const $measures = userMeasures(measures, user);
      // get department name from department id
      const departmentName = getDepartmentNameFromId(user.department);
      // calculate the rating for each user
      const rating = totalRating($measures);
      // verify the measures weight per user add up to 100
      const weightValidity = verifyTotalWeight($measures);
      // weight value
      const weight = totalWeight($measures);

      // user performance data
      const userPerformanceData: IUserPerformanceData = {
        measures: $measures,
        weightValidity,
        departmentName,
        rating,
        uid: user.uid,
        userName: user.displayName || "",
        weight,
        department: user.department,
      };
      data.push(userPerformanceData);
    }

    // load to report store
    store.report.loadUserPerformanceData(data);
  }, [measures, users, getDepartmentNameFromId, store.report, verifyTotalWeight]);

  useEffect(() => {
    userPerformanceData();
    return () => { };
  }, [userPerformanceData]);

  // load users from db
  const loadAll = useCallback(async () => {
    setLoading(true); // start loading
    try {
      await api.user.getAll();
      await api.department.getAll();
      await api.measure.getAll();
      await api.objective.getAll();
      if (fyid) {
        await api.companyMeasure.getAll(fyid);
        await api.companyObjective.getAll(fyid);
      }
    } catch (error) {
    }
    setLoading(false); // stop loading
  }, [
    api.user,
    api.department,
    api.measure,
    api.objective,
    api.companyMeasure,
    api.companyObjective,
    fyid,
  ]);

  useEffect(() => {
    loadAll();
    return () => { };
  }, [loadAll]);

  return (
    <ErrorBoundary>
      <div className="reports uk-section">
        <div className="uk-container uk-container-xlarge">
          <ErrorBoundary>
            <ReportTabs
              selectedTab={selectedTab}
              setselectedTab={setselectedTab}
            />
          </ErrorBoundary>
          <ErrorBoundary>{loading && <LoadingEllipsis />}</ErrorBoundary>
          <ErrorBoundary>
            {!loading && selectedTab === "strategy-tab" && (<StrategyTabContent />)}
            {!loading && selectedTab === "department-tab" && (<DepartmentTabContent />)}
            {!loading && selectedTab === "people-tab" && <PeopleTabContent />}
            {!loading && selectedTab === "execution-tab" && (<ExecutionTabContent />)}
          </ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  );
});

export default Reports;
