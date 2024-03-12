import { observer } from "mobx-react-lite";
import { Fragment, useCallback, useEffect, useState } from "react";
import MeasureCompany from "../../../shared/models/MeasureCompany";
import MeasureItem from "./MeasureItem";

interface IProps {
  measures: MeasureCompany[];
}
const Measures = observer((props: IProps) => {
  const { measures } = props;

  const [filteredMeasures, setFilteredMeasures] = useState<MeasureCompany[]>([]);
  const [count, setCount] = useState(5);
  const [status, setStatus] = useState("all");

  const sortByRate = (data: MeasureCompany[], orderType: "asc" | "dsc") => {
    if (orderType === "asc")
      // order in ascending order
      return data.sort((a, b) => a.asJson.q4AutoRating - b.asJson.q4AutoRating);
    return data.sort((a, b) => b.asJson.q4AutoRating - a.asJson.q4AutoRating);
  };

  const filterByDepartment = useCallback(() => {
    const filtered = measures.filter((measure) => {
      if (status === "all") return true;
      if (status === "red") return measure.asJson.q4AutoRating < 2;
      // if (status === "yellow") return measure.asJson.rating <= 2;
      if (status === "green") return measure.asJson.q4AutoRating >= 3;
      return false;
    });

    const sorted =
      count === -1
        ? sortByRate(filtered.slice(), "dsc")
        : sortByRate(filtered.slice(0, count), "dsc");
    setFilteredMeasures(sorted);
  }, [count, measures, status]);

  useEffect(() => {
    filterByDepartment();
  }, [filterByDepartment]);

  // TODO: filter by KPI status | Red,Green, Amber.
  // TODO: filter deparment KPIs.
  return (
    <div className="red-measures uk-card uk-card-default uk-card-body uk-card-small">
      <div className="header uk-margin">
        <h4 className="title kit-title">KPIs/Measures:</h4>

        <select
          id="category"
          className="uk-select uk-form-small uk-margin-left"
          name="category"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="red">Red Measures</option>
          <option value="green">Green Measures</option>
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
          <option value={-1}>All</option>
        </select>
      </div>

      <div className="measures">
        <ul className="uk-list uk-list-striped uk-margin">
          {filteredMeasures.map((measure) => (
            <Fragment key={measure.asJson.id}>
              <MeasureItem measure={measure.asJson} />
            </Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
});

export default Measures;
