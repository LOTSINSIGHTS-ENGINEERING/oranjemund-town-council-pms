import { Fragment, useEffect, useState } from "react";
import ObjectiveCompany from "../../../shared/models/ObjectiveCompany";
import ObjectiveItem from "./ObjectiveItem";

interface IProps {
  objectives: ObjectiveCompany[];
}
const Objectives = (props: IProps) => {
  const { objectives } = props;
  const [count, setCount] = useState(5);
  const [filteredObjectives, setFilteredObjectives] = useState<ObjectiveCompany[]>([]);

  useEffect(() => {
    const filtered = count === -1 ? objectives.slice() : objectives.slice(0, count);
    setFilteredObjectives(filtered);
    return () => { };
  }, [objectives, count]);

  return (
    <div className="objectives-card uk-card uk-card-default uk-card-body uk-card-small">
      <div className="header uk-margin">
        <h4 className="title kit-title">Objectives ✓:</h4>
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

      <ul className="uk-list uk-list-striped uk-margin">
        {filteredObjectives.map((objective) => (
          <Fragment key={objective.asJson.id}>
            <ObjectiveItem objective={objective.asJson} />
          </Fragment>
        ))}
      </ul>
    </div>
  );
};

export default Objectives;
