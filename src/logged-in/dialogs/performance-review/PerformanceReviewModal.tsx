import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { defaultScorecardMetadata, IScorecardMetadata } from "../../../shared/models/ScorecardMetadata";
import MODAL_NAMES from "../ModalName";
import PerformanceReviewForm from "./PerformanceReviewForm";

const PerformanceReviewModal = observer(() => {
  const { api, store, ui } = useAppContext();

  const [performanceReview, setPeformanceReview] = useState<IScorecardMetadata>(
    { ...defaultScorecardMetadata }
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      await api.individualScorecardMetadata.update(performanceReview);
      setLoading(false);
      // show success
      ui.snackbar.load({
        id: Date.now(),
        message: "Performance review updated",
        type: "success",
      });
    } catch (error) {
      // show error
      ui.snackbar.load({
        id: Date.now(),
        message: "Error updating performance review",
        type: "danger",
      });
    }

    onCancel();
  };

  const onCancel = () => {
    hideModalFromId(MODAL_NAMES.PERFORMANCE_REVIEW.REVIEW_MODAL);
  };

  useEffect(() => {
    const updateForm = () => {
      const agreement = store.individualScorecardMetadata.selected;
      if (!agreement) return;

      setPeformanceReview({
        ...defaultScorecardMetadata,
        ...agreement,
      });
    };

    updateForm();
  }, [store.individualScorecardMetadata.selected]);

  return (
    <div className="performance-review-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">
        Scorecard for {performanceReview.displayName}
      </h3>

      <div className="dialog-content uk-position-relative">
        <form
          className="uk-form-stacked uk-grid-small"
          data-uk-grid
          onSubmit={handleSubmit}
        >
          <PerformanceReviewForm
            performanceReview={performanceReview}
            setPerformanceReview={setPeformanceReview}
          />

          <div className="uk-width-1-1 uk-text-right">
            <button
              className="btn-text uk-margin-right"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              Save {loading && <div data-uk-spinner="ratio: .5"></div>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default PerformanceReviewModal;
