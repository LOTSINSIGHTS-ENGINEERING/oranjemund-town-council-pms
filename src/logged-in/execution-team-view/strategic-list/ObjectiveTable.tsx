import { observer } from "mobx-react-lite";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import { IMeasure } from "../../../shared/models/Measure";
import { IObjective } from "../../../shared/models/Objective";
import EmptyError from "../../admin-settings/EmptyError";
import { totalFinalIndividualObjectiveRating } from "../../shared/functions/Scorecard";
import MeasureTable from "./MeasureTable";
import ObjectiveTableItem from "./ObjectiveTableItem";

interface IProps {
  objectives: IObjective[];
  getMeasures: (objective: IObjective) => IMeasure[];
}

const ObjectiveTable = observer((props: IProps) => {
  const { objectives, getMeasures } = props;

  // calculate rating
  const calculateRating = (objective: IObjective) => {
    const measures = getMeasures(objective);
    const measuresUpdated = measures.filter((m) => m.isUpdated).length > 0;
    const rating = totalFinalIndividualObjectiveRating(measures);
    return {
      rate: rating || 1,
      isUpdated: measuresUpdated,
    };
  };

  return (
    <ErrorBoundary>
      <div className="objective-table uk-margin">
        <ErrorBoundary>
          {objectives.map((objective) => (
            <ErrorBoundary key={objective.id}>
              <ObjectiveTableItem
                objective={objective}
                rating={calculateRating(objective).rate}
                isUpdated={calculateRating(objective).isUpdated}
              >
                <MeasureTable measures={getMeasures(objective)} />
              </ObjectiveTableItem>
            </ErrorBoundary>
          ))}
        </ErrorBoundary>

        {/* Empty */}
        <ErrorBoundary>
          {!objectives.length && (
            <EmptyError errorMessage="No objective found" />
          )}
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
});

export default ObjectiveTable;
