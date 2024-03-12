import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../shared/functions/Context";
import { IMeasure } from "../../../shared/models/Measure";
import { IObjective } from "../../../shared/models/Objective";
import ObjectiveTable from "./ObjectiveTable";

interface IProps {
  uid: string;
}

const StrategicList = observer((props: IProps) => {
  const { store } = useAppContext();
  const { uid } = props;

  const objectives = store.objective.getByUid(uid).map((o) => o.asJson);

  // Get measures that belong to objective
  const getMeasures = (objective: IObjective): IMeasure[] => {
    return store.measure.all
      .filter((measure) => measure.asJson.objective === objective.id)
      .map((measure) => measure.asJson);
  };

  return (
    <div className="strategic-list uk-margin">
      <div>
        <ObjectiveTable objectives={objectives} getMeasures={getMeasures} />
      </div>
    </div>
  );
});

export default StrategicList;
