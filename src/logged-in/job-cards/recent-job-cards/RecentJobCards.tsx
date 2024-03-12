import { useEffect, useState } from "react";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../../shared/functions/Context";
import { IJobCard } from "../../../shared/models/job-card-model/Jobcard";
import { LoadingEllipsis } from "../../../shared/components/loading/Loading";

interface IProps {
  jobcards: IJobCard[];
}

const DeductionSubmissionCard = (props: IProps) => {
  const { jobcards } = props;
  const { api } = useAppContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);
        await Promise.all([api.jobcard.jobcard.getAll()]);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    loadAll();
  }, [api.jobcard]);

  // Only display the recent 3 job cards
  const recentJobCards = jobcards.slice(0, 2);

  return (
    <ErrorBoundary>
      {!loading &&
        recentJobCards.map((jobcard) => (
          <div className="uk-grid uk-grid-small" data-uk-grid key={jobcard.id}>
            <div className="uk-card uk-card-default uk-card-small uk-width-1-1">
              <div className="uk-card-body">
                <div className="uk-grid" data-uk-grid>
                  <div className="uk-width-expand">
                    <span>Description:</span>
                    <h4 className="main-title-small uk-margin-small-left">
                      {jobcard.jobDescription}
                    </h4>
                  </div>
                  <div className="uk-width-1-3">
                    <button className="btn btn-primary">Acknowledge</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      {loading && <LoadingEllipsis />}
    </ErrorBoundary>
  );
};

export default DeductionSubmissionCard;
