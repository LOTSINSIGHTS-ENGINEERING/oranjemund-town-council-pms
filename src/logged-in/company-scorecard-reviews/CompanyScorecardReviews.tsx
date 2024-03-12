import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import { useAppContext } from "../../shared/functions/Context";
import useTitle from "../../shared/hooks/useTitle";
import EmptyError from "../admin-settings/EmptyError";
import useBackButton from "../../shared/hooks/useBack";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import ScorecardBatch, { IScorecardBatch } from "../../shared/models/ScorecardBatch";
import { useNavigate } from "react-router-dom";

interface IFYPlanProps {
  scorecardBatch: IScorecardBatch;
}
const FYPlan = (props: IFYPlanProps) => {
  const { scorecardBatch } = props;
  const { id, description, locked } = scorecardBatch;
  const fyPlanCssClass = locked ? "FY-plan FY-plan__locked uk-card uk-card-default uk-card-body uk-card-small" : "FY-plan uk-card uk-card-default uk-card-body uk-card-small";

  const navigate = useNavigate();

  const onUpdate = () => {
    navigate(id);
  };

  return (
    <ErrorBoundary>
      <div className={fyPlanCssClass}>
        <h6 className="title">
          {description}
          {locked && (
            <>
              <span className="lock-icon" data-uk-icon="icon: lock"></span>
            </>
          )}
        </h6>
      </div>

      <div className="company-scorecard uk-card uk-card-default uk-card-body uk-card-small">
        <h6 className="name">
          <span className="span-label">Name</span>
          Company Scorecard {description}
        </h6>
        <div className="controls">
          <button disabled={locked} className="btn btn-primary" onClick={onUpdate}>
            View <span uk-icon="arrow-right"></span>
          </button>
        </div>
      </div>
    </ErrorBoundary>
  );
};

const CompanyScorecardReviews = observer(() => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);
  useTitle("Evaluation of company scorecards");

  useBackButton();

  const sortFY = (a: ScorecardBatch, b: ScorecardBatch) => {
    return b.asJson.description.localeCompare(a.asJson.description);
  };

  useEffect(() => {
    // load scorecard batch from db
    const loadAll = async () => {
      setLoading(true); // start loading
      try {
        await api.scorecard.getAll();
      } catch (error) {
        console.log(error);
      }
      setLoading(false); // stop loading
    };
    loadAll();
  }, [api.scorecard]);

  return (
    <ErrorBoundary>
      <div className="company-plan-page uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          {!loading &&
            store.scorecard.all.sort(sortFY).map((batch) => (
              <div key={batch.asJson.id} className="uk-margin">
                <FYPlan scorecardBatch={batch.asJson} />
              </div>
            ))}

          {/* Empty & not loading */}
          {!store.scorecard.all.length && !loading && (
            <EmptyError errorMessage="No scorecard found" />
          )}

          {/* Loading */}
          {loading && <LoadingEllipsis />}
        </div>
      </div>
    </ErrorBoundary>
  );
});

export default CompanyScorecardReviews;
