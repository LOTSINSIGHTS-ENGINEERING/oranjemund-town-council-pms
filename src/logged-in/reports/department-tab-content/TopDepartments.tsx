import { IDepartmentPeformanceData } from "../../../shared/models/Report";

interface IProps {
  data: IDepartmentPeformanceData[];
}

const TopDepartments = (props: IProps) => {
  const { data } = props;
  //order
  const sortByRate = (
    data: IDepartmentPeformanceData[],
    orderType: "asc" | "dsc"
  ) => {
    if (orderType === "asc")
      // order in ascending order
      return data.sort((a, b) => a.avg - b.avg);
    return data.sort((a, b) => b.avg - a.avg);
  };

  const sortedData = sortByRate(data, "dsc");

  return (
    <>
      <div className="department-tab-content uk-card uk-card-default uk-card-body uk-card-small">
        <div className="header uk-margin">
          <h4 className="title kit-title">Departmental Performance Rating</h4>
        </div>

        <table className="kit-table uk-table uk-table-small uk-table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Department</th>
              <th>Average Rating</th>
              <th>Median Rating</th>
              <th>Minimum Rating</th>
              <th>Maximum Rating</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((department, index) => (
              <tr key={department.id}>
                <td>{index + 1}</td>
                <td>{department.departmentName}</td>
                <td>{department.avg}</td>
                <td>{department.median}</td>
                <td>{department.min}</td>
                <td>{department.max}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TopDepartments;
