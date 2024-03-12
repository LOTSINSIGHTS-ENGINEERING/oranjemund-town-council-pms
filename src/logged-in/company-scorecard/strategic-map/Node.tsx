import { observer } from "mobx-react-lite";
import { useCallback } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import showModalFromId from "../../../shared/functions/ModalShow";
import { IMeasureCompany } from "../../../shared/models/MeasureCompany";
import { IObjectiveCompany } from "../../../shared/models/ObjectiveCompany";
import MODAL_NAMES from "../../dialogs/ModalName";
import StatusDirection from "../../dialogs/strategic-map-objective/StatusDirection";
import { totalQ4CompanyObjectiveRating } from "../../shared/functions/Scorecard";

interface INode {
  objective: IObjectiveCompany;
}
const Node = observer((props: INode) => {
  const { objective } = props;
  const { store } = useAppContext();

  const handleViewObjectiveOverviewMap = () => {
    store.companyObjective.select(objective);
    showModalFromId(MODAL_NAMES.EXECUTION.COMPANY_MAP_OVERVIEW_MODAL);
  };

  // Get measures that belong to objective
  const getMeasures = useCallback((): IMeasureCompany[] => {
    return store.companyMeasure.all.filter((measure) => measure.asJson.objective === objective.id).map((measure) => measure.asJson);
  }, [objective.id, store.companyMeasure]);

  const calculateRating = useCallback(() => {
    const measures = getMeasures();
    const rating = totalQ4CompanyObjectiveRating(measures);
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
