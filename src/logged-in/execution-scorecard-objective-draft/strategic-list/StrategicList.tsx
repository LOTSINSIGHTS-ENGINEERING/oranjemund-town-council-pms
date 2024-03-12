import { observer } from "mobx-react-lite";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../../shared/functions/Context";
import { IMeasure } from "../../../shared/models/Measure";
import { IObjective } from "../../../shared/models/Objective";
import MeasureTable from "./MeasureTable";

interface IProps {
  objective: IObjective;
}
const StrategicList = observer((props: IProps) => {
  const { store } = useAppContext();
  const { objective } = props;

  // Get measures that belong to objective
  const getMeasures = (): IMeasure[] => {
    return store.measure.all
      .filter((measure) => measure.asJson.objective === objective.id)
      .map((measure) => measure.asJson);
  };

  return (
    <ErrorBoundary>
      <div className="uk-margin">
        <div className="uk-card uk-card-default uk-card-body uk-card-small">
          <MeasureTable measures={getMeasures()} />
        </div>
      </div>
    </ErrorBoundary>
  );
});

export default StrategicList;
