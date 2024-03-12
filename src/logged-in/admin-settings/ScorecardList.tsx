import { observer } from "mobx-react-lite";
import { useCallback } from "react";
import { ErrorAlert } from "../../shared/components/alert/Alert";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../shared/functions/Context";
import ScorecardBatch from "../../shared/models/ScorecardBatch";
import EmptyError from "./EmptyError";
import ScorecardItem from "./ScorecardItem";

const ScorecardList = observer(() => {
  const { store } = useAppContext();

  // multiple scorecards active
  const multipleActive = useCallback(() => {
    return (
      store.scorecard.all.filter((scorecard) => scorecard.asJson.active)
        .length > 1
    );
  }, [store.scorecard.all]);

  const sortFY = (a: ScorecardBatch, b: ScorecardBatch) => {
    return b.asJson.description.localeCompare(a.asJson.description);
  };

  return (
    <ErrorBoundary>
      <div className="scorecard-batch-list">
        {/* Error Multiple scorecards active */}
        <ErrorBoundary>
          {multipleActive() && (
            <ErrorAlert msg="Error! You cannot have multiple scorecards/batches active." />
          )}
        </ErrorBoundary>

        <ErrorBoundary>
          {store.scorecard.all.sort(sortFY).map((batch) => (
            <div key={batch.asJson.id}>
              <ScorecardItem scorecardBatch={batch.asJson} />
            </div>
          ))}
        </ErrorBoundary>

        {/* Empty & not loading */}
        <ErrorBoundary>
          {!store.scorecard.all.length && (
            <EmptyError errorMessage="No scorecards found" />
          )}
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
});

export default ScorecardList;
