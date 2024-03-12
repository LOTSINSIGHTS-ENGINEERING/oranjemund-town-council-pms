import { useCallback, useEffect, useState } from "react";
import Department from "../../../shared/models/Department";
import UserPerformanceData from "../../../shared/models/Report";

interface IProps {
  data: UserPerformanceData[];
  departments: Department[];
}
const WorstPerformers = (props: IProps) => {
  const { data, departments } = props;
  const [performanceData, setPerformanceData] = useState<UserPerformanceData[]>(
    []
  );
  const [count, setCount] = useState(5);
  const [department, setDepartment] = useState("company");

  const sortByRate = (
    data: UserPerformanceData[],
    orderType: "asc" | "dsc"
  ) => {
    if (orderType === "asc")
      // order in ascending order
      return data.sort((a, b) => a.asJson.rating - b.asJson.rating);
    return data.sort((a, b) => b.asJson.rating - a.asJson.rating);
  };

  const filterByDepartment = useCallback(() => {
    if (department === "company") {
      setPerformanceData(sortByRate(data.slice(0, count), "dsc"));
    } else {
      const filteredData = data.filter(
        (item) => item.asJson.department === department
      );
      setPerformanceData(sortByRate(filteredData.slice(0, count), "dsc"));
    }
  }, [count, data, department]);

  useEffect(() => {
    filterByDepartment();
    return () => {};
  }, [filterByDepartment]);

  return (
    <>
      <div className="people-tab-content uk-card uk-card-default uk-card-body uk-card-small">
        <div className="header uk-margin">
          <h4 className="title kit-title">
            Training &#38; Coaching Recommended Employees{" "}
          </h4>

          <select
            id="category"
            className="uk-select uk-form-small uk-margin-left"
            name="category"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="company">Company</option>
            <optgroup label="--Departments --">
              {departments.map((dep) => (
                <option key={dep.asJson.id} value={dep.asJson.id}>
                  {dep.asJson.name}
                </option>
              ))}
            </optgroup>
          </select>

          <select
            id="count"
            className="uk-select uk-form-small uk-margin-left"
            name="count"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={"All"}>All</option>
          </select>
        </div>

        <table className="kit-table uk-table uk-table-small uk-table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Scorecard</th>
              <th>Department</th>
              <th>Performance</th>
            </tr>
          </thead>
          <tbody>
            {performanceData.map((user, index) => (
              <tr key={user.asJson.uid}>
                <td>{index + 1}</td>
                <td>{user.asJson.userName}</td>
                <td>{user.asJson.departmentName}</td>
                <td>{user.asJson.rating || 1}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default WorstPerformers;
