import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState } from "react";
import { useAppContext } from "../../shared/functions/Context";
import showModalFromId from "../../shared/functions/ModalShow";
import { IMeasureDepartment } from "../../shared/models/MeasureDepartment";
import { IObjective } from "../../shared/models/Objective";
import MODAL_NAMES from "../dialogs/ModalName";
import StatusDirection from "../dialogs/strategic-map-objective/StatusDirection";
import { totalQ4CompanyObjectiveRating } from "../shared/functions/Scorecard";

interface INode {
  objective: IObjective;
}
const Node = observer((props: INode) => {
  const { objective } = props;
  const { store } = useAppContext();
  const [rating, setRating] = useState(1);
  // const [rateCss, setRateCss] = useState("grey");

  const handleViewObjectiveOverviewMap = () => {
    store.departmentObjective.select(objective);
    showModalFromId(MODAL_NAMES.EXECUTION.MAP_OVERVIEW_MODAL);
  };

  // Get measures that belong to objective
  const getMeasures = useCallback((): IMeasureDepartment[] => {
    return store.departmentMeasure.all
      .filter((measure) => measure.asJson.objective === objective.id)
      .map((measure) => measure.asJson);
  }, [objective.id, store.departmentMeasure.all]);

  const calculateRating = useCallback(() => {
    const measures = getMeasures();
    const rating = totalQ4CompanyObjectiveRating(measures);
    setRating(rating);
  }, [getMeasures]);

  useEffect(() => {
    calculateRating();
  }, [calculateRating]);

  return (
    <li
      className={`objective-node ${objective.perspective}`}
      onClick={handleViewObjectiveOverviewMap}
    >
      <h6 className="objective-node-title">{objective.description}</h6>

      <StatusDirection rating={rating} />
    </li>
  );
});

export default Node;
