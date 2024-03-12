import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import { FormEvent, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { IScorecardMetadata } from "../../../shared/models/ScorecardMetadata";
import MODAL_NAMES from "../ModalName";

interface IProps {
  agreement: IScorecardMetadata;
}
const CompanyScorecardQ2ApprovalModal = observer((props: IProps) => {
  const { agreement } = props;
  const { api, ui } = useAppContext();
  const [comment, setComment] = useState<string>("");
  const [discussion, setDiscussion] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true); // start loading
    const $agreement: IScorecardMetadata = { ...agreement };
    $agreement.quarter2Review.comments = comment;
    $agreement.quarter2Review.status = "approved";
    $agreement.quarter3Review.status = "in-progress";
    await update($agreement);
    setLoading(false); // stop loading

    onCancel();
  };

  const update = async (agreement: IScorecardMetadata) => {
    try {
      await api.companyScorecardMetadata.update(agreement);
      // snackbar
      ui.snackbar.load({
        id: Date.now(),
        message: "Approved Scorecard.",
        type: "success",
      });
      // email
      // push notification
    } catch (error) {
      // console.log(error);
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to approved Scorecard.",
        type: "danger",
      });
    }
  };

  const onCancel = () => {
    hideModalFromId(MODAL_NAMES.EXECUTION.COMPANY_Q2_APPROVAL_MODAL);
  };

  return (
    <div className="scorecard-approval-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">Quarter 2 Review Approval</h3>

      <div className="dialog-content uk-position-relative">
        <div
          className="uk-alert-primary uk-padding-small uk-margin"
          data-uk-alert
        >
          <p>The Quarter 2 will be locked after approval.</p>
        </div>

        <form
          className="uk-form-stacked uk-grid-small"
          data-uk-grid
          onSubmit={handleSubmit}
        >
          <div className="uk-width-1-1">
            <label className="uk-form-label" htmlFor="kpi-appraisal">
              Feedback (optional)
              <div className="field-info uk-margin-small-left">
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  className="icon"
                  fontSize="xs"
                />
                <p className="description">
                  Objective weight is used to prioritize certain objectives over
                  the others.
                </p>
              </div>
            </label>
            <div className="uk-form-controls">
              <textarea
                className="uk-textarea uk-form-small"
                id="kpi-appraisal"
                rows={3}
                placeholder="Appraisals"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>

          <div className="uk-width-1-1">
            <div className="uk-form-controls ">
              <label className="uk-form-label">
                <input
                  className="uk-checkbox uk-margin-small-right"
                  type="checkbox"
                  placeholder="Discussion"
                  checked={discussion}
                  onChange={(e) => setDiscussion(e.target.checked)}
                  required
                />
                Confirm that you had a discussion with the employee!
                <div className="field-info uk-margin-small-left">
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="icon"
                    fontSize="xs"
                  />
                  <p className="description">
                    Objective weight is used to prioritize certain objectives
                    over the others.
                  </p>
                </div>
              </label>
            </div>
          </div>

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
              Approve {loading && <div data-uk-spinner="ratio: .5"></div>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default CompanyScorecardQ2ApprovalModal;
