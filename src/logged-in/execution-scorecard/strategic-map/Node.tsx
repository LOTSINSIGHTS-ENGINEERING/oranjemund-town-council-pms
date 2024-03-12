import { observer } from "mobx-react-lite";
import { useCallback } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import showModalFromId from "../../../shared/functions/ModalShow";
import { IMeasure } from "../../../shared/models/Measure";
import { IObjective } from "../../../shared/models/Objective";
import MODAL_NAMES from "../../dialogs/ModalName";
import StatusDirection from "../../dialogs/strategic-map-objective/StatusDirection";
import { totalFinalIndividualObjectiveRating } from "../../shared/functions/Scorecard";

interface INode {
  objective: IObjective;
}
const Node = observer((props: INode) => {
  const { objective } = props;
  const { store } = useAppContext();

  const handleViewObjectiveOverviewMap = () => {
    store.objective.select(objective);
    showModalFromId(MODAL_NAMES.EXECUTION.MAP_OVERVIEW_MODAL);
  };

  // Get measures that belong to objective
  const getMeasures = useCallback((): IMeasure[] => {
    return store.measure.all
      .filter((measure) => measure.asJson.objective === objective.id)
      .map((measure) => measure.asJson);
  }, [objective.id, store.measure]);

  const calculateRating = useCallback(() => {
    const measures = getMeasures();
    const rating = totalFinalIndividualObjectiveRating(measures);
    return rating;
  }, [getMeasures]);

  return (
    <li
      className={`objective-node ${objective.perspective}`}
      onClick={handleViewObjectiveOverviewMap}
    >
      <h6 className="objective-node-title">{objective.description}</h6>

      <StatusDirection rating={calculateRating()} />
    </li>
  );
});

export default Node;
