import React, { FormEvent, useState } from "react";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../shared/functions/Context";
import { IReviewCycleType, IScorecardBatch, IReviewScorecardBatch } from "../../shared/models/ScorecardBatch";

interface IReviewInfoProps {
  openStage: IReviewCycleType;
  batch: IScorecardBatch;
  setBatch: React.Dispatch<React.SetStateAction<IScorecardBatch>>;
  unsavedChanges: boolean;
  setUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
  discardChanges: () => void;
}
const StageSettings = (props: IReviewInfoProps) => {
  const { api, store } = useAppContext();
  const { openStage, batch, setBatch, unsavedChanges, discardChanges } = props;

  const [submitType, setSubmitType] = useState<"SAVE_CHANGES" | "START_SESSION" | "END_SESSION">("SAVE_CHANGES");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitType === "SAVE_CHANGES") onSaveChanges();
    else if (submitType === "START_SESSION") onStartSession();
    else if (submitType === "END_SESSION") onEndSession();
  };

  const onSaveChanges = async () => {
    try {
      await api.scorecard.update(batch); // update db.
      store.scorecard.setActive(batch); // set active.
    } catch (error) {
      console.log("Error saving changes:", error);
    }
  };

  const onStartSession = async () => {
    const $batch: IScorecardBatch = { ...batch };
    switch (openStage) {
      case "Scorecard":
        $batch.draftReview.status = "in-progress";
        break;
      case "Q1 Reviews":
        $batch.quarter1Review.status = "in-progress";
        break;
      case "Midterm Reviews":
        $batch.midtermReview.status = "in-progress";
        break;
      case "Q3 Reviews":
        $batch.quarter3Review.status = "in-progress";
        break;
      case "Assessment":
        $batch.finalAssessment.status = "in-progress";
        break;
      default:
        $batch.draftReview.status = "in-progress";
        break;
    }

    try {
      await api.scorecard.update($batch); // update db.
      store.scorecard.setActive($batch); // set active.
    } catch (error) {
      console.log("Error starting session:", error);
    }
  };

  const onEndSession = async () => {
    const $batch: IScorecardBatch = { ...batch };
    switch (openStage) {
      case "Scorecard":
        $batch.draftReview.status = "approved";
        break;
      case "Q1 Reviews":
        $batch.quarter1Review.status = "approved";
        break;
      case "Midterm Reviews":
        $batch.midtermReview.status = "approved";
        break;
      case "Q3 Reviews":
        $batch.quarter3Review.status = "approved";
        break;
      case "Assessment":
        $batch.finalAssessment.status = "approved";
        break;
      default:
        $batch.draftReview.status = "approved";
        break;
    }

    try {
      await api.scorecard.update($batch); // update db.
      store.scorecard.setActive($batch); // set active.
    } catch (error) {
      console.log("Error starting session:", error);
    }
  };

  const value = (key: keyof IReviewScorecardBatch) => {
    switch (openStage) {
      case "Scorecard":
        return batch.draftReview[key];
      case "Q1 Reviews":
        return batch.quarter1Review[key];
      case "Midterm Reviews":
        return batch.midtermReview[key];
      case "Q3 Reviews":
        return batch.quarter3Review[key];
      case "Assessment":
        return batch.finalAssessment[key];
      default:
        return batch.draftReview[key];
    }
  };

  const onChange = (e: FormEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;

    switch (openStage) {
      case "Scorecard":
        setBatch({
          ...batch,
          draftReview: { ...batch.draftReview, [name]: value },
        });
        break;

      case "Q1 Reviews":
        setBatch({
          ...batch,
          quarter1Review: { ...batch.quarter1Review, [name]: value },
        });
        break;

      case "Midterm Reviews":
        setBatch({
          ...batch,
          midtermReview: { ...batch.midtermReview, [name]: value },
        });
        break;

      case "Q3 Reviews":
        setBatch({
          ...batch,
          quarter3Review: { ...batch.quarter3Review, [name]: value },
        });
        break;

      case "Assessment":
        setBatch({
          ...batch,
          finalAssessment: { ...batch.finalAssessment, [name]: value },
        });
        break;

      default:
        console.log("Default case");

        setBatch({
          ...batch,
          draftReview: { ...batch.draftReview, [name]: value },
        });
        break;
    }
  };

  return (
    <ErrorBoundary>
      <form
        className="review-info uk-card uk-card-default uk-card-body uk-card-small"
        onSubmit={onSubmit}
      >
        <h6 className="title">Date &#38; Status Settings for {openStage}</h6>

        <div className="uk-grid-small" data-uk-grid>
          <div className="uk-width-1-2@s uk-width-1-4@m">
            <div>
              <label className="uk-form-label" htmlFor="user-fname">
                Start Date
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input uk-form-small"
                  type="date"
                  name="startDate"
                  value={value("startDate")}
                  onChange={onChange}
                  required
                />
              </div>
            </div>
          </div>
          <div className="uk-width-1-2@s uk-width-1-4@m">
            <div>
              <label className="uk-form-label" htmlFor="user-fname">
                End Date
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input uk-form-small"
                  type="date"
                  name="endDate"
                  value={value("endDate")}
                  onChange={onChange}
                  required
                />
              </div>
            </div>
          </div>
          <div className="uk-width-1-2@s uk-width-1-4@m">
            <div>
              <label className="uk-form-label" htmlFor="user-fname">
                Expected Results (%)
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input uk-form-small"
                  type="text"
                  name="expectedPercentageResults"
                  placeholder="Expected results"
                  value={value("expectedPercentageResults")}
                  onChange={onChange}
                  required
                />
              </div>
            </div>
          </div>
          <div className="uk-width-1-2@s uk-width-1-4@m">
            <div>
              <label className="uk-form-label" htmlFor="user-status">
                Status
              </label>
              <div className="uk-form-controls">
                <select
                  className="uk-select uk-form-small"
                  name="status"
                  value={value("status")}
                  onChange={onChange}
                  required
                >
                  <option value={"pending"}>Pending</option>
                  <option value={"cancelled"}>Cancelled</option>
                  <option value={"in-progress"}>In Progress</option>
                  <option value={"completed"}>Completed</option>
                </select>
              </div>
            </div>
          </div>
          {/* <div className="uk-width-1-1@s">
            <div>
              <label className="uk-form-label" htmlFor="user-fname">
                Description
              </label>
              <div className="uk-form-controls">
                <textarea className="uk-textarea uk-form-small" />
              </div>
            </div>
          </div> */}
        </div>

        <div className="uk-text-right uk-margin">
          {unsavedChanges && (
            <>
              <button
                className="btn btn-primary uk-margin-right"
                type="submit"
                onClick={() => setSubmitType("SAVE_CHANGES")}
              >
                Save Changes
              </button>
              <button
                className="btn btn-danger"
                type="button"
                onClick={discardChanges}
              >
                Discard Changes
              </button>
            </>
          )}

          {!unsavedChanges && (
            <>
              <button
                className="btn btn-primary uk-margin-right"
                type="submit"
                disabled={"in-progress" === value("status")}
                onClick={() => setSubmitType("START_SESSION")}
              >
                Start Session
              </button>
              <button
                className="btn btn-danger"
                type="submit"
                disabled={!("in-progress" === value("status"))}
                onClick={() => setSubmitType("END_SESSION")}
              >
                End Session
              </button>
            </>
          )}
        </div>
      </form>
    </ErrorBoundary>
  );
};

export default StageSettings;
