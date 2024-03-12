import { observer } from "mobx-react-lite";
import React from "react";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import { IScorecardMetadata } from "../../../shared/models/ScorecardMetadata";
import { IReviewCycleStatus } from "../../../shared/models/ScorecardBatch";

interface IProps {
  performanceReview: IScorecardMetadata;
  setPerformanceReview: React.Dispatch<React.SetStateAction<IScorecardMetadata>>;
}

const PerformanceReviewForm = observer((props: IProps) => {
  const { performanceReview, setPerformanceReview } = props;

  const handleDraftChange = (value: string | number) => {
    const status = value.toString() as IReviewCycleStatus;

    const _performanceReview = { ...performanceReview };
    _performanceReview.agreementDraft.status = status;

    setPerformanceReview(_performanceReview);
  };

  const handleMidtermChange = (value: string | number) => {
    const status = value.toString() as IReviewCycleStatus;

    const _performanceReview = { ...performanceReview };
    _performanceReview.quarter2Review.status = status;

    setPerformanceReview(_performanceReview);
  };

  const handleAssessmentChange = (value: string | number) => {
    const status = value.toString() as IReviewCycleStatus;

    const _performanceReview = { ...performanceReview };
    _performanceReview.quarter4Review.status = status;

    setPerformanceReview(_performanceReview);
  };

  return (
    <ErrorBoundary>
      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="kpi-draft-select">
          Draft
        </label>
        <div className="uk-form-controls">
          <select
            className="uk-select uk-form-small"
            id="kpi-draft-select"
            value={performanceReview.agreementDraft.status}
            onChange={(e) => handleDraftChange(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="submitted">Submitted</option>
            <option value="cancelled">Cancelled</option>
            <option value="approved">Approved</option>
          </select>
        </div>
      </div>

      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="kpi-midterm-select">
          Midterm
        </label>
        <div className="uk-form-controls">
          <select
            className="uk-select uk-form-small"
            id="kpi-midterm-select"
            value={performanceReview.quarter2Review.status}
            onChange={(e) => handleMidtermChange(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="submitted">Submitted</option>
            <option value="cancelled">Cancelled</option>
            <option value="approved">Approved</option>
          </select>
        </div>
      </div>

      <div className="uk-width-1-1">
        <label className="uk-form-label" htmlFor="kpi-assessment-select">
          Assessment
        </label>
        <div className="uk-form-controls">
          <select
            className="uk-select uk-form-small"
            id="kpi-assessment-select"
            value={performanceReview.quarter4Review.status}
            onChange={(e) => handleAssessmentChange(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="submitted">Submitted</option>
            <option value="cancelled">Cancelled</option>
            <option value="approved">Approved</option>
          </select>
        </div>
      </div>
    </ErrorBoundary>
  );
});

export default PerformanceReviewForm;
