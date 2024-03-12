import LineGraph from "../../../shared/components/graph-components/LineGraph";

const DepartmentQ2Q = () => {
  // analytics on people per rating.
  const labels = ["2021 Q1", "2021 Q2", "2021 Q3 ", "2021 Q4"];
  const data = labels.map((label) => 1 + Math.random() * 4);

  return (
    <div className="department-q2q-performance uk-card uk-card-default uk-card-body uk-card-small">
      <div className="header uk-margin">
        <h4 className="title kit-title">Department: </h4>

        <select
          id="category"
          className="uk-select uk-form-small uk-margin-left"
          name="category"
        >
          <option value="company">Exploration</option>
          <option value="company">ICT Department</option>
        </select>
      </div>

      <div className="chart" style={{ height: 450 }}>
        <LineGraph title="" ylabel="Q-Q" labels={labels} data={data} />
      </div>
    </div>
  );
};

export default DepartmentQ2Q;
