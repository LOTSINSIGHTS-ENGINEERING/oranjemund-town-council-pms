import TopDepartments from "./TopDepartments";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../shared/functions/Context";
import { IDepartmentPeformanceData } from "../../../shared/models/Report";

const DepartmentTabContent = observer(() => {
  const { store } = useAppContext();

  // user data
  const userPerformanceData = store.report.allUserPerformanceData;

  // department performance
  const departmentPerformance = (): IDepartmentPeformanceData[] => {
    const data = store.department.all.map((department) => {
      // get department performance data.
      const performanceData = userPerformanceData.filter(
        (dep) => dep.asJson.department === department.asJson.id
      );

      // calculate the department performance values[avg, weight, min, max]
      const avg =
        performanceData.reduce(
          (acc, dep) => acc + (dep.asJson.rating || 1),
          0
        ) / performanceData.length;
      const avgRounded = Math.round(avg * 10) / 10 || 1;
      // weight
      const weight =
        performanceData.reduce((acc, dep) => acc + dep.asJson.weight, 0) || 0;
      // min
      const min = performanceData.reduce(
        (acc, dep) => (acc < dep.asJson.rating ? acc : dep.asJson.rating || 1),
        1
      );
      // max
      const max = performanceData.reduce(
        (acc, dep) => (acc > dep.asJson.rating ? acc : dep.asJson.rating || 1),
        1
      );

      //median
      const performanceDataLength = performanceData.length;
      const median =
        performanceDataLength !== 0
          ? performanceDataLength % 2 === 0
            ? ((performanceData[performanceDataLength / 2 - 1].asJson.rating ||
                1) + performanceData[performanceDataLength / 2].asJson.rating ||
                1) / 2
            : performanceData[(performanceDataLength - 1) / 2].asJson.rating ||
              1
          : 1;

      return {
        id: department.asJson.id,
        departmentName: department.asJson.name,
        avg: avgRounded,
        weight,
        min,
        max,
        median,
        total: performanceDataLength,
      } as IDepartmentPeformanceData;
    });

    return data;
  };

  return (
    <div className="department-tab-content">
      <div
        className="uk-grid-small uk-child-width-1-1@m uk-grid-match"
        data-uk-grid
      >
        {/* <div>
          <DepartmentQ2Q />
        </div> */}
        <div>
          <TopDepartments data={departmentPerformance()} />
        </div>
      </div>
    </div>
  );
});

export default DepartmentTabContent;
